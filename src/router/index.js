import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  // {
  //   path: '/',
  //   redirect: '/login',
  // },
  {
    path: '/',
    component: () => import('@/views/layout'),
    redirect: '/home', // 默认显示首页的二级路由
    children: [
      {
        path: 'home',
        component: () => import('@/views/home'),
      },
      {
        path: 'user-info',
        component: () => import('@/views/user/userInfo.vue'),
      },
      {
        path: 'user-avatar',
        component: () => import('@/views/user/userAvatar.vue'),
      },
    ],
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
const whiteList = ['/login', '/reg'] // 白名单

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  const token = store.state.token
  if (token) {
    if (!store.state.userInfo.username) {
      // 你现在本地有token值， 才去请求用户信息
      store.dispatch('getUserInfoAction')
    }
    next()
  } else {
    // 未登录
    // next()强制切换到登陆
    // includes(值) ,作用：判断值是否在数组里出现过，出现过原地返回true
    if (whiteList.includes(to.path)) {
      // 未登录，可以访问的路由地址，则放行
      next()
    } else {
      next('/login')
    }
  }
})

export default router
