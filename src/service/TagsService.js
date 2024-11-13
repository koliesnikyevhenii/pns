import AxiosFactory from '@/service/AxiosFactory.js';
import tagsListStub from '@/stubs/tag.json';
import store from '@/store/index.js';

export const TagService = {
    async getTags() {
        if (AxiosFactory.debugMode) {
            return Promise.resolve(tagsListStub);
        };

        const body = {
            apiKey: store.getters.apiKey
        };

        const result = await AxiosFactory.pnsApi
            .post('/tags', body)
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    }
};
