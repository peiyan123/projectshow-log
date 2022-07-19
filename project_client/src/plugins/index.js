// import Vue from 'vue'
import { axios } from '@/utils/createApiServices'
export default {
  install(Vue) {
    Vue.prototype.$api = axios
  }
}