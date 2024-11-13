// src/store/index.js
import { createStore } from 'vuex';

export default createStore({
    state: {
        authToken: localStorage.getItem('authToken') || null,
        apiKey: null
    },
    mutations: {
        setAuthToken(state, token) {
            state.authToken = token;
            localStorage.setItem('authToken', token);
        },
        clearAuthToken(state) {
            state.authToken = null;
            localStorage.removeItem('authToken');
        },
        setApiKey(state, apiKey) {
            state.apiKey = apiKey;
        }
    },
    actions: {
        login({ commit }, token) {
            commit('setAuthToken', token);
        },
        logout({ commit }) {
            commit('clearAuthToken');
        },
        setApiKey({ commit }, apiKey) {
            commit('setApiKey', apiKey);
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.authToken,
        apiKey: (state) => state.apiKey,
    }
});
