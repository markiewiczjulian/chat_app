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
  setCurrentUser({ commit }, userName) {
    commit("SET_USER", userName);
    const randomAvatarNum = 1 + Math.floor(20 * Math.random());
    commit("SET_AVATAR", randomAvatarNum);
  },
  removeCurrentUser({ commit }) {
    commit("REMOVE_USER");
  },
};

export const getters = {
  getCurrentUser: (state) => {
    return Object.keys(state.user).length ? state.user : null;
  },
  getCurrentUserAvatar: (state) => {
    return Object.keys(state.avatar).length ? state.avatar : null;
  },
};
