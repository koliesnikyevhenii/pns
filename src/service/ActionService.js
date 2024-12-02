import AxiosFactory from '@/service/AxiosFactory.js';
import actionsListStub from '@/stubs/actions.json';

export const ActionService = {
    async getActions(apiKey) {
        if (AxiosFactory.debugMode) {
            return Promise.resolve(actionsListStub);
        }

        const body = {
            apiKey: apiKey
        };

        const result = await AxiosFactory.pnsApi
            .post('/payload/actions', body)
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    },

    async createAction(apiKey, action) {
        if (AxiosFactory.debugMode) {
            return;
        }
        const body = {
            action: action.actionName,
            description: action.description,
            apiKey: apiKey
        };

        const result = await AxiosFactory.pnsApi
            .post('/payload/actions/create', body)
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    },

    async deleteAction(apiKey, actionId) {
        if (AxiosFactory.debugMode) {
            return;
        }
        const body = {
            apiKey: apiKey
        };

        const result = await AxiosFactory.pnsApi
            .delete(`/payload/actions/${actionId}`, { data: body })
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    }
};
