import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/global.less'
import '@/elementUI/index.js'

import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import dayjs from 'dayjs'
// 封装一个dayjs全局函数格式化时间
Vue.prototype.$formatDate = (dateObj) => {
  return dayjs(dateObj).format('YYYY-MM-DD HH:mm:ss')
}

Vue.use(VueQuillEditor) // 此方法内会用Vue.component注册quillEditor名字全局组件

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app')
