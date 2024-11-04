import axios from 'axios';
import appListStub from '@/stubs/apps.json';
import appStub from '@/stubs/app.json';

const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE == 'true';

const axiosBase = axios.create({
    baseURL: import.meta.env.VITE_PNS_API_BASE_URL
    //withCredentials: true //TODO: api authorization
});

export const ApplicationService = {
    async getApplications() {
        if (DEBUG_MODE) {
            return appListStub;
        }

        const result = await axiosBase.get('apps', { params: { includeChart: true } });
        return result.data;
    },

    async getApplication(id) {
        if (DEBUG_MODE) {
            return appStub;
        }

        const result = await axiosBase.get(`apps/${id}`);
        return result.data;
    },

    addApplication(app) {
        //if (DEBUG_MODE) {
        return {
            code: 0,
            data: {
                id: 53,
                apiKey: '49c38617-adbb-4895-9d8c-3bb5af06b319',
                credentials: [],
                messagesPerDay: null,
                name: 'App name',
                description: 'App description'
            }
        };
        //}

        //const result = axiosBase.post(`apps/${id}`, app);
    },

    editApplication(app) {
        //if (DEBUG_MODE) {
        return {
            code: 0,
            data: {
                id: 53,
                apiKey: '49c38617-adbb-4895-9d8c-3bb5af06b319',
                credentials: [],
                messagesPerDay: null,
                name: 'App name',
                description: 'App description'
            }
        };
        //}

        //const result = axiosBase.put(`apps/${id}`, app);
    },

    deleteApplication(id) {
        if (DEBUG_MODE) {
            return { code: 0, data: 'OK' };
        }

        const result = axiosBase.delete(`apps/${id}`);
        return result.data;
    },

    deleteApp(appId) {
        return Promise.resolve(ApplicationService.deleteApplication(appId));
    }
};
