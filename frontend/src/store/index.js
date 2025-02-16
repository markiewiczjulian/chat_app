import Vue from "vue";
import Vuex from "vuex";
import * as user from "@/store/modules/user.js";
import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
  },
  mutations: {},
  actions: {},
  getters: {},
  plugins: [createPersistedState()],
});
