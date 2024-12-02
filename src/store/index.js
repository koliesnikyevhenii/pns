// src/store/index.js
import { createStore } from 'vuex';
import { ApplicationService } from '@/service/ApplicationService';
import AxiosFactory from '@/service/AxiosFactory';

export default createStore({
    state: {
        authToken: null,
        user: null,
        apiKeys: new Map(),
        apiKeyIsLoading: false,
        loadingPromise: null
    },
    mutations: {
        setAuth(state, { token, user }) {
            state.authToken = token;
            state.user = user;
        },
        clearAuth(state) {
            state.authToken = null;
            state.user = null;
        },
        setApiKey(state, { appId, apiKey }) {
            state.apiKeys.set(appId.toString(), apiKey);
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
        async login({ commit }, credentials) {
            const body = {
                creds: credentials
            };
            await AxiosFactory.pnsApi.post('/member/autentication', body).then((response) => {
                if (response.data.code === 0) {
                    const token = response.data.data.token;
                    const user = response.data.data.member;

                    commit('setAuth', { token: token, user: user });
                    localStorage.setItem('token', token);

                    return token;
                } else {
                    throw new Error(response.data.errorMessage);
                }
            });
        },
        logout({ commit }) {
            commit('clearAuth');
            localStorage.removeItem('token');
        },
        initializeAuth({ commit }) {
            const token = localStorage.getItem('token');
            if (token) {
                commit('setAuth', { token: token });
            }
        },
        setApiKey({ commit }, { appId, apiKey }) {
            commit('setApiKey', { appId: appId, apiKey: apiKey });
        },
        async fetchApiKey({ commit, state }, props) {
            if (state.apiKeys.get(props.appId)) {
                return;
            }

            if (state.apiKeyIsLoading) {
                return state.loadingPromise;
            }

            commit('setApiKeyIsLoading', true);

            const promise = ApplicationService.getApplication(props.appId)
                .then((response) => {
                    if (response.code === 0) {
                        commit('setApiKey', { appId: props.appId, apiKey: response.data.apiKey });
                        return response.data.apiKey;
                    } else {
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
        getUser: (state) => state.user,
        getAuthToken: (state) => state.authToken,
        getApiKeyForApp: (state) => (appId) => {
            return state.apiKeys.get(appId) || null;
        }
    }
});
