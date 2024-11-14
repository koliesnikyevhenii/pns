// src/store/index.js
import { createStore } from 'vuex';
import { ApplicationService } from '@/service/ApplicationService';

export default createStore({
    state: {
        authToken: localStorage.getItem('authToken') || null,
        apiKey: null,
        apiKeyLoading: false,
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
            state.apiKeyLoading = false;
        },
        setApiKeyLoading(state, loading) {
            state.apiKeyLoading = loading;
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
        },
        async fetchApiKey({ commit, state }, appId) {
            if (state.apiKey || state.apiKeyLoading) {
                return;
            }

            commit('setApiKeyLoading', true);

            try {
                const response = await ApplicationService.getApplication(appId);
                commit('setApiKey', response.data.apiKey);
            } catch (error) {
                console.error('Failed to fetch API key:', error);
            }
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.authToken,
        apiKey: (state) => state.apiKey,
    }
});
