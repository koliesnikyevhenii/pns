import axios from 'axios';
import store from '@/store';

export default {
    debugMode: import.meta.env.VITE_DEBUG_MODE == 'true',

    pnsApi: (() => {
        const instance = axios.create({
            baseURL: import.meta.env.VITE_PNS_API_BASE_URL
            // withCredentials: true // Uncomment if your API requires cookies
        });

        instance.interceptors.request.use(
            (config) => {
                const token = store.getters.getAuthToken;
                if (token) {
                    config.headers['X-Token'] = token;
                }
                return config;
            },
        );
        return instance;
    })()
};
