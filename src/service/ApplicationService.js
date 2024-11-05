import AxiosFactory from '@/service/AxiosFactory.js';
import appListStub from '@/stubs/apps.json';
import appStub from '@/stubs/app.json';
import credsAndroid from '@/stubs/credsAndroid.json';
import credsiOS from '@/stubs/credsiOS.json';

export const ApplicationService = {
    async getApplications() {
        if (AxiosFactory.debugMode) {
            return appListStub;
        }

        const result = await AxiosFactory.pnsApi.get('apps', { params: { includeChart: true } });
        return result.data;
    },

    async getApplication(id) {
        if (AxiosFactory.debugMode) {
            return appStub;
        }

        const result = await AxiosFactory.pnsApi.get(`apps/${id}`);
        return result.data;
    },

    async addApplication(app) {
        if (AxiosFactory.debugMode) {
            return appStub;
        }

        const result = await AxiosFactory.pnsApi.post(`apps`, app);
        return result.data;
    },

    async editApplication(id, app) {
        if (AxiosFactory.debugMode) {
            return appStub;
        }

        const result = await AxiosFactory.pnsApi.put(`apps/${id}`, app);
        return result.data;
    },

    async deleteApplication(id, app) {
        if (AxiosFactory.debugMode) {
            return { code: 0, data: 'OK' };
        }

        const result = await AxiosFactory.pnsApi.delete(`apps/${id}`, app);
        return result.data;
    },

    async postCredentials(id, creds) {
        if (AxiosFactory.debugMode) {
            return creds?.os == 1 ? credsAndroid : credsiOS;
        }

        const result = await AxiosFactory.pnsApi.post(`apps/${id}/credentials`, creds);
        return result.data;
    },

    async deleteCredentials(id, creds) {
        if (AxiosFactory.debugMode) {
            return { code: 0, data: 'OK' };
        }

        const result = await AxiosFactory.pnsApi.delete(`apps/${id}/credentials`, { data: creds });
        return result.data;
    },

    addApp(app) {
        return Promise.resolve(ApplicationService.addApplication(app));
    },

    editApp(appId, app) {
        return Promise.resolve(ApplicationService.editApplication(appId, app));
    },

    deleteApp(appId) {
        return Promise.resolve(ApplicationService.deleteApplication(appId));
    }
};
