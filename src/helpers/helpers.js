import store from '@/store';

export const removeSpacesFromObjectKeys = (obj) => {
    return Object.keys(obj).reduce((acc, key) => {
        const newKey = key.replace(/\s+/g, '');
        acc[newKey] = obj[key];
        return acc;
    }, {});
};

export const getApiKey = async (appId) => {
    let apiKey = store.getters.apiKey;

    if (!apiKey) {
        await store.dispatch('fetchApiKey', appId);
        apiKey = store.getters.apiKey;
    }

    return apiKey;
};
