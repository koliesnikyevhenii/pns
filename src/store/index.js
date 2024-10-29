// src/store/index.js
import { createStore } from 'vuex';

export default createStore({
    state: {
        authToken: localStorage.getItem('authToken') || null
    },
    mutations: {
        setAuthToken(state, token) {
            state.authToken = token;
            localStorage.setItem('authToken', token);
        },
        clearAuthToken(state) {
            state.authToken = null;
            localStorage.removeItem('authToken');
        }
    },
    actions: {
        login({ commit }, token) {
            commit('setAuthToken', token);
        },
        logout({ commit }) {
            commit('clearAuthToken');
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.authToken
    }
});
