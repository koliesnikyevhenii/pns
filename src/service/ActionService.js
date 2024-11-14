import AxiosFactory from '@/service/AxiosFactory.js';
import actionsListStub from '@/stubs/actions.json';
import { getApiKey } from '@/helpers/helpers';

export const ActionService = {
    async getActions(appId) {
        if (AxiosFactory.debugMode) {
            return Promise.resolve(actionsListStub);
        }

        const body = {
            apiKey: await getApiKey(appId)
        };

        const result = await AxiosFactory.pnsApi
            .post('/payload/actions', body)
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    },

    async createAction(appId, action) {
        if (AxiosFactory.debugMode) {
            return;
        }
        const body = {
            action: action.actionName,
            description: action.description,
            apiKey: await getApiKey(appId)
        };

        const result = await AxiosFactory.pnsApi
            .post('/payload/actions/create', body)
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    },

    async deleteAction(appId, actionId) {
        if (AxiosFactory.debugMode) {
            return;
        }
        const body = {
            apiKey: await getApiKey(appId)
        };

        const result = await AxiosFactory.pnsApi
            .delete(`/payload/actions/${actionId}`, { data: body })
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    }
};
