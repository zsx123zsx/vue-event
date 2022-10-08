import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/layout',
    component: () => import('@/views/layout'),
  },
  {
    path: '/reg',
    component: () => import('@/views/register'),
  },
  {
    path: '/login',
    component: () => import('@/views/login'),
  },
]

const router = new VueRouter({
  routes,
})

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token && !store.state.userInfo.username) {
    // 你现在本地有token值， 才去请求用户信息
    store.dispatch('getUserInfoAction')
  }
  next()
})

export default router
