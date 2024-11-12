import AxiosFactory from '@/service/AxiosFactory.js';
import actionsListStub from '@/stubs/actions.json';

export const ActionService = {
    async getActions() {
        // if (AxiosFactory.debugMode) {
        //     return Promise.resolve(actionsListStub);
        // }

        const body = {
            apiKey: 'dbadec88-44bb-454b-b608-bddb4cd6ae6f'
        };

        const result = await AxiosFactory.pnsApi
            .post('/payload/actions', body)
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    },

    async createAction(action) {
        if (AxiosFactory.debugMode) {
            return;
        }
        const body = {
            action: action.actionName,
            description: action.description,
            apiKey: 'dbadec88-44bb-454b-b608-bddb4cd6ae6f'
        };

        const result = await AxiosFactory.pnsApi
            .post('/payload/actions/create', body)
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    },

    async deleteAction(actionId) {
        if (AxiosFactory.debugMode) {
            return;
        }
        const body = {
            apiKey: 'dbadec88-44bb-454b-b608-bddb4cd6ae6f'
        };

        const result = await AxiosFactory.pnsApi
            .delete(`/payload/actions/${actionId}`, { data: body })
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    }
};
