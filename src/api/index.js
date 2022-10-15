// 封装的是具体的接口请求方法
// 注意：每个方法只负责请求一个url地址
import request from '@/utils/request' // 引入自定义axios函数
// import store from '@/store'

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
    // headers: {
    //   Authorization: store.state.token,
    // },
  })
}

/** 获取侧边栏的数据    promise对象 */

export const getMenusListAPI = () => {
  return request({
    url: '/my/menus',
    // headers: {
    //   Authorization: store.state.token,
    // },
  })
}

/**
 *  更新用户信息
 * @param {*} param0
 * @returns
 */
export const updateUserInfoAPI = ({
  id,
  username,
  nickname,
  email,
  user_pic,
}) => {
  return request({
    url: '/my/userinfo',
    method: 'PUT',
    data: {
      id,
      username,
      nickname,
      email,
      user_pic,
    },
  })
}

/**
 *  更新-用户头像
 * @param {*} avatar 头像图片base64字符串
 * @returns  Promise对象
 */
export const updateUserAvatarAPI = (avatar) => {
  return request({
    url: '/my/update/avatar',
    method: 'PATCH',
    data: {
      avatar, // 头像base64字符串
    },
  })
}

/**
 *  更新-用户密码 { old_pwd:旧密码，new_pwd: 新密码, re_pwd : 确认新密码 }
 * @param {*} param0
 * @returns   Promise对象
 */
export const updatePwdAPI = ({ old_pwd, new_pwd, re_pwd }) => {
  return request({
    url: '/my/updatepwd',
    method: 'PATCH',
    data: {
      old_pwd,
      new_pwd,
      re_pwd,
    },
  })
}

/**
 *  获取-文章分类
 * @returns  Promise对象
 */
export const getArtCateListAPI = () => {
  return request({
    url: '/my/cate/list',
  })
}

/**
 *  增加-文章分类
 * @param {*} param0 {cate_name:文章分类名，cate_alias:文章分类别名}
 * @returns  Promise对象
 */
export const saveArtCateAPI = ({ cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/add',
    method: 'POST',
    data: {
      cate_name,
      cate_alias,
    },
  })
}

/**
 *  更新文章的分类
 * @param {*} param0   id，文章分类名字，文章分类别名
 * @returns  Promise对像
 */
export const updaeArtCateAPI = ({ id, cate_name, cate_alias }) => {
  return request({
    url: '/my/cate/info',
    method: 'PUT',
    data: {
      id,
      cate_name,
      cate_alias,
    },
  })
}

/**
 * 删除-文章的分类
 * @param {*} id 文章分类的id
 * @returns  Promise对象
 */
export const delArtCateAPI = (id) => {
  return request({
    url: '/my/cate/del',
    method: 'delete',
    params: {
      id,
    },
  })
}

/**
 *  发布文章
 * @param {*} fd  FormData 表单数据对象
 * @returns  Promise对象
 */
export const uploadArticleAPI = (fd) => {
  return request({
    url: '/my/article/add',
    method: 'POST',
    data: fd,
  })
  // { }如果是一个普通对象，axios会把它转换成json字符串请求体里交个后台
  // 这个接口文档要求请求体里是一个FormaData类型(表单数据对象)携带文件给后台
}

/**
 *  获取-文章列表
 * @param {*} param0 { pagenum:当前页码, pagesize：当前页需要的数据条数, cate_id：文章分类id, state：文章状态 }
 * @returns  Promise对象
 */
export const getArtListAPI = ({ pagenum, pagesize, cate_id, state }) => {
  return request({
    url: '/my/article/list',
    params: {
      pagenum,
      pagesize,
      cate_id,
      state,
    },
  })
}

/**
 *  获取-文章详情
 * @param {*} id 文章id
 * @returns  Promise对象
 */
export const getArtDetailAPI = (id) => {
  return request({
    url: '/my/article/info',
    params: {
      id,
    },
  })
}

/**
 *  删除文章
 * @param {*} id 文章id
 * @returns  Promise
 */
export const delArticleAPI = (id) => {
  return request({
    url: '/my/article/info',
    method: 'DELETE',
    params: {
      id,
    },
  })
}
