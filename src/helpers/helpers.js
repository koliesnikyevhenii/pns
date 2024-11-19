import store from '@/store';

export const removeSpacesFromObjectKeys = (obj) => {
    return Object.keys(obj).reduce((acc, key) => {
        const newKey = key.replace(/\s+/g, '');
        acc[newKey] = obj[key];
        return acc;
    }, {});
};

export const getApiKey = async (appId, router, toast) => {
    let apiKey = store.getters.getApiKeyForApp(appId);

    if (apiKey) {
        return apiKey;
    }
    
    return await store.dispatch('fetchApiKey', { appId: appId, toast: toast, router: router });
};
