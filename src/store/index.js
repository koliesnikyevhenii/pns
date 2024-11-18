// src/store/index.js
import { createStore } from 'vuex';
import { ApplicationService } from '@/service/ApplicationService';

export default createStore({
    state: {
        authToken: localStorage.getItem('authToken') || null,
        apiKey: null,
        apiKeyIsLoading: false,
        loadingPromise: null
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
            state.apiKeyIsLoading = false;
            state.loadingPromise = null;
        },
        setApiKeyIsLoading(state, loading) {
            state.apiKeyIsLoading = loading;
        },
        setLoadingPromise(state, promise) {
            state.loadingPromise = promise;
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
        async fetchApiKey({ commit, state }, props) {
            if (state.apiKey) {
                return;
            };

            if (state.apiKeyIsLoading) {
                return state.loadingPromise;
            };

            commit('setApiKeyIsLoading', true);

            const promise = ApplicationService.getApplication(props.appId)
                .then((response) => {
                    if (response.code === 0) {
                        commit('setApiKey', response.data.apiKey);
                        return response.data.apiKey;
                    } else {
                        console.log(props)
                        commit('setApiKeyIsLoading', false);
                        commit('setLoadingPromise', null);
                        props.toast.add({
                            severity: 'error',
                            summary: 'Service error',
                            detail: response.errorMessage ?? `Error during fetching the apiKey for app: ${props.appId}`,
                            life: 5000
                        });
                        props.router.push({ name: 'dashboard' });
                    }
                })
                .catch((error) => {
                    commit('setApiKeyIsLoading', false);
                    commit('setLoadingPromise', null);
                    console.error('Failed to fetch API key:', error);
                    throw error;
                });

            commit('setLoadingPromise', promise);
            return promise;
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.authToken,
        apiKey: (state) => state.apiKey
    }
});
