import axios from 'axios';
import actionsListStub from '@/stubs/actions.json';

const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE == 'true';

const axiosBase = axios.create({
    baseURL: import.meta.env.VITE_PNS_API_BASE_URL
});

export const ActionService = {
    async getActions() {
        if (DEBUG_MODE) {
            return actionsListStub;
        }

        const body = {
            apiKey: "dbadec88-44bb-454b-b608-bddb4cd6ae6f",
        }

        const result = await axiosBase
            .post('/payload/actions', body)
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    },

    async createAction(action) {
        if (DEBUG_MODE) {
            return;
        }
        const body = {
            action: action.actionName,
            description: action.description,
            apiKey: "dbadec88-44bb-454b-b608-bddb4cd6ae6f",
        }

        const result = await axiosBase
            .post('/payload/actions/create', body)
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    },

    async deleteAction(actionId) {
        if (DEBUG_MODE) {
            return;
        }
        const body = {
            apiKey: 'dbadec88-44bb-454b-b608-bddb4cd6ae6f',
        };

        const result = await axiosBase
            .delete(`/payload/actions/${actionId}`, { data: body })
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    }
};
