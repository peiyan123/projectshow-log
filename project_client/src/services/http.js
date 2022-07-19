import createApiServices from '../utils/createApiServices'

export default createApiServices({
	getData: 'get|getData',
	setData: 'post|setData',
  getUser: 'get|getUser',
  setUser: 'post|signUser',
	setPic: 'post|pic/setPic',
})