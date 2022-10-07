import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: '', // 保存token字符串
  },
  mutations: {
    updateToken(state, val) {
      state.token = val
    },
  },
  plugins: [createPersistedState()], // 注入持久化插件
})
