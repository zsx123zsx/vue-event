import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/global.less'
import '@/elementUI/index.js'

new Vue({
  store,
  router,
  render: (h) => h(App),
}).$mount('#app')
