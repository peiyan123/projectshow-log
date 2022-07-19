import Vue from 'vue'
import App from './App.vue'
import plugins from './plugins'
import router from './router'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueI18n from 'vue-i18n'
import zhCN from '@/i18n/zh-CN'
import enUS from '@/i18n/en-US'
import jaJP from '@/i18n/ja-JP'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.config.productionTip = false
Vue.use(plugins);
Vue.use(Antd)
Vue.use(ElementUI)
Vue.use(VueI18n)
Vue.use(mavonEditor)

// 准备翻译的语言环境信息
const messages = {
  en: {
    message: {
      ...enUS
    }
  },
  ja: {
    message: {
      ...jaJP
    }
  },
  zh: {
    message: {
      ...zhCN
    }
  }
}
let lang = localStorage.getItem('lang') || 'zh-cn'
const i18n = window.i18n = new VueI18n({
  locale: lang, // 设置地区
  messages, // 设置地区信息
})
localStorage.setItem('lang', lang)
new Vue({
  router,
  i18n,
  render: h => h(App),
}).$mount('#app')
