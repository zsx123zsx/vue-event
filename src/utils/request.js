// 基于axios封装，网络请求的函数
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'

// axios.create()创建一个带配置项的自定义axios函数
// myAxios请求的时候，地址baseURL+url,然后去请求后台
const myAxios = axios.create({
  baseURL: 'http://big-event-vue-api-t.itheima.net',
})

// 定义请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    if (store.state.token) {
      config.headers.Authorization = store.state.token
    }

    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 定义响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    // 响应状态码为 2xx 时触发成功的回调，形参中的 response 是“成功的结果”
    return response
  },
  function (error) {
    // 响应状态码不是 2xx 时触发失败的回调，形参中的 error 是“失败的结果”
    console.dir(error)

    if (error.response.status === 401) {
      // 无效的 token
      // 把 Vuex 中的 token 重置为空，并跳转到登录页面
      store.commit('updateToken', '')
      router.push('/login')
      Message.error('用户身份信息已过期！')
    }

    return Promise.reject(error)
  }
)
export default myAxios
