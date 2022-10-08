// 封装的是具体的接口请求方法
// 注意：每个方法只负责请求一个url地址
import request from '@/utils/request' // 引入自定义axios函数
import store from '@/store'

export const registerAPI = ({ username, password, repassword }) => {
  return request({
    url: '/api/reg',
    method: 'POST',
    data: {
      username,
      password,
      repassword,
    },
  })
}

// 登陆
export const loginAPI = ({ username, password }) => {
  return request({
    url: '/api/login',
    method: 'POST',
    data: {
      username,
      password,
    },
  })
}

/**
 * 获取用户信息
 * @returns  promise对象
 */
export const getUserInfoAPI = () => {
  return request({
    url: '/my/userinfo',
    headers: {
      Authorization: store.state.token,
    },
  })
}

/** 获取侧边栏的数据    promise对象 */

export const getMenusListAPI = () => {
  return request({
    url: '/my/menus',
    headers: {
      Authorization: store.state.token,
    },
  })
}
