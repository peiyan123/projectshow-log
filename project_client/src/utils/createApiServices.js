import axios from 'axios'
// import notification from 'ant-design-vue/es/notification'

axios.defaults.timeout = 50 * 1000

axios.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  res => {
    console.log('res', res)
    const { status, data } = res
    if (status === 200) {
      return data
    } else {
      console.log('异常处理!')
      return Promise.reject(res)
    }
  },
  error => {
    const { response } = error
    let _error = {}
    if (response) {
      _error.code = response.data.code || response.status
      _error.message = response.data.msg || response.data.error || '未知错误!'
    } else {
      _error = { ...error }
      _error.message = error.data.message || error.data.error || '网络错误！'
    }
    // popup error message show in page
    // notification.error({
    //   message: _error.message
    // })
    return Promise.reject(error)
  }
)

export { axios }

/*
 *  urlTemplate:请求方法|url|缓存
 *
 */
const API_ROOT = process.env.NODE_ENV === 'production' ? '' : window.API_ROOT || '/api'
const SERVICES_CACHE = {}
const createApiService = function(name, urlTemplate) {
  let [method, path, isCache] = urlTemplate.split('|')
  method = method.toLocaleLowerCase()
  let urlApi
  if (path.indexOf('pic/') != -1) {
    urlApi = `${/^\/.+/.test(path) ? '' : '/'}${path}`
  } else {
    urlApi = `${API_ROOT}${/^\/.+/.test(path) ? '' : '/'}${path}`
  }
  const service = function(data, options = { fixedUrl: {} }) {
    if (isCache && SERVICES_CACHE[urlApi]) {
      return SERVICES_CACHE[urlApi]
    }
    const reqConfig = {
      headers: {
        'Content-Type' : "application/json",
      }
    }
    let url = urlApi

    if (options) {
      if (options.fixedUrl) {
        Object.keys(options.fixedUrl).map(key => {
          url = url.replace(`{${key}}`, options.fixedUrl[key])
        })
      }

      if (options.headers) {
        reqConfig.headers = { ...options.headers }
      }

      if (options.params) {
        reqConfig.params = options.params
      }
    }

    if (options.responseType) {
      reqConfig.responseType = options.responseType
    }

    let res

    if (isCache && !SERVICES_CACHE[url]) {
      reqConfig.headers['cache-api-in-page'] = true
    }

    if (['get', 'delete'].includes(method)) {
      reqConfig.params = data || {}
      reqConfig.params.t = +new Date()
      res = axios[method](url, reqConfig)
    } else {
      res = axios[method](url, data, reqConfig)
    }
    return res
  }
  service.url = urlApi
  return service
}

const createApiServices = function(urlTemplates) {
  const apiList = {}
  Object.keys(urlTemplates).map(name => {
    apiList[name] = createApiService(name, urlTemplates[name])
  })
  return apiList
}

export default createApiServices
