import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  plugins: [createPersistedState()],

  state: {
    user: {
      loggedIn: false,
      data: null
    },
    viewMode: 'small',
  },

  getters: {
    user(state){
      return state.user
    },
    viewMode(state){
      return state.viewMode
    }
  },

  mutations: {
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
    },
    OUT_USER: state => {
      state.user = { loggedIn: false, data: null };
    },
    SET_VIEW_MODE(state, value) {
      state.viewMode = value
    },
  },

  actions: {
    fetchUser({ commit }, user) {
      commit("SET_LOGGED_IN", user !== null);
      if (user) {
        commit("SET_USER", {
          displayName: user.displayName,
          email: user.email
        });
      } else {
        commit("SET_USER", null);
      }
    },

    logoutUser: context => {
      context.commit('OUT_USER');
    },

    setViewMode({commit}, viewMode) {
      commit('SET_VIEW_MODE', viewMode)
    }
  }
});