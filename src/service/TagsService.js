import AxiosFactory from '@/service/AxiosFactory.js';
import tagsListStub from '@/stubs/tag.json';

export const TagService = {
    async getTags() {
        // if (AxiosFactory.debugMode) {
        //     return Promise.resolve(tagsListStub);
        // };

        const body = {
            apiKey: 'dbadec88-44bb-454b-b608-bddb4cd6ae6f'
        };

        const result = await AxiosFactory.pnsApi
            .post('/tags', body)
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    }
};
