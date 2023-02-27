/*
 * @Author: yumiazusa yumiazusa@hotmail.com
 * @Date: 2023-02-13 16:00:23
 * @LastEditors: yumiazusa yumiazusa@hotmail.com
 * @LastEditTime: 2023-02-27 10:54:05
 * @FilePath: /www/miledo/admin/src/main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import '@/assets/css/base.scss'
import App from './App'
import store from './store'
import router from './router'

import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

// import "e-icon-picker/lib/symbol.js"; //基本彩色图标库
// import 'e-icon-picker/lib/index.css'; // 基本样式，包含基本图标
import 'font-awesome/css/font-awesome.min.css'; //font-awesome 图标库
import 'element-ui/lib/theme-chalk/icon.css'; //element-ui 图标库

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})
// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 页面粒子效果
import VueParticles from "vue-particles"
Vue.use(VueParticles)
Vue.config.devtools = true
import waves from '@/directive/waves'
Vue.use(waves)
import Pagination from '@/components/Pagination'
Vue.component("pagination",Pagination)
import SDatePicker from '@/components/common/SDatePicker/SDatePicker'
Vue.component("s-date-picker",SDatePicker)
Vue.config.productionTip = false
import iconPicker from 'vue-fontawesome-elementui-icon-picker';
Vue.use(iconPicker);
import Base from './assets/js/base.js'
Vue.prototype.$base = Base
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
