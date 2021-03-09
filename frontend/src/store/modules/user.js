export const namespaced = true;

export const state = {
  user: {},
  avatar: {},
};

export const mutations = {
  SET_USER(state, user) {
    state.user = user;
  },
  REMOVE_USER(state) {
    state.user = {};
  },
  SET_AVATAR(state, avatar) {
    state.avatar = avatar;
  },
  REMOVE_AVATAR(state) {
    state.avatar = {};
  },
};

export const actions = {
  setCurrentUser({ commit }, payload) {
    commit("SET_USER", payload.userName);
    commit("SET_AVATAR", payload.avatarNum || "1");
  },
  removeCurrentUser({ commit }) {
    commit("REMOVE_USER");
    commit("REMOVE_AVATAR");
  },
};

export const getters = {
  getCurrentUser: (state) => {
    return state.user && Object.keys(state.user).length ? state.user : null;
  },
  getCurrentUserAvatar: (state) => {
    return state.avatar && Object.keys(state.avatar).length ? state.avatar : null;
  },
  getUserAvatar: (state) => {
    return state.avatar && Object.keys(state.avatar).length ? state.avatar : null;
  },
};
