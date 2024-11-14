import { getApiKey } from '@/helpers/helpers';
import AxiosFactory from '@/service/AxiosFactory.js';
import tagsListStub from '@/stubs/tag.json';

export const TagService = {
    async getTags(appId) {
        if (AxiosFactory.debugMode) {
            return Promise.resolve(tagsListStub);
        };

        const body = {
            apiKey: await getApiKey(appId)
        };

        const result = await AxiosFactory.pnsApi
            .post('/tags', body)
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    }
};
