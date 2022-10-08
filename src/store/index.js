import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { getUserInfoAPI } from '@/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '', // 保存token字符串
    userInfo: {}, // 保存用户信息（id,username,nickname,email,user_pic）
  },
  getters: {
    username: (state) => state.userInfo.username, // 用户名
    nickname: (state) => state.userInfo.nickname, // 用户昵称
    user_pic: (state) => state.userInfo.user_pic, // 用户头像
  },
  mutations: {
    updateToken(state, val) {
      state.token = val
    },

    // 保存用户信息
    updateUserInfo(state, val) {
      state.userInfo = val
    },
  },
  actions: {
    // 请求 -> 用户信息
    async getUserInfoAction(store) {
      const res = await getUserInfoAPI()
      console.log(res)
      store.commit('updateUserInfo', res.data.data)
    },
  },
  plugins: [createPersistedState()], // 注入持久化插件
})
