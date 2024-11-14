import AxiosFactory from '@/service/AxiosFactory.js';
import devicesListStub from '@/stubs/devices.json';
import { getApiKey } from '@/helpers/helpers';

export const DeviceService = {
    //Searching and sorting are not implemented on the backend, 
    //so we retrieve the entire collection and perform sorting on the frontend.
    // async getDevices(page, pageSize) {
    //     if (AxiosFactory.debugMode) {
    //         return Promise.resolve(devicesListStub);
    //     }

    //     const body = {
    //         apiKey : "dbadec88-44bb-454b-b608-bddb4cd6ae6f",
    //         page: page,
    //         pageSize: pageSize
    //     }

    //     const result = await AxiosFactory.pnsApi
    //         .post('/devices/paging', body, {
    //             params: { includeTags: true }
    //         })
    //         .then((response) => response)
    //         .catch((error) => console.log(error));

    //     return result.data;
    // },
    async getDevices(appId) {
        if (AxiosFactory.debugMode) {
            return Promise.resolve(devicesListStub);
        }

        const body = {
            apiKey: await getApiKey(appId)
        };

        const result = await AxiosFactory.pnsApi
            .post('/devices', body, {
                params: { includeTags: true }
            })
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    },

    async deleteDevice(appId, deviceAlias) {
        if (AxiosFactory.debugMode) {
            return;
        }

        const body = {
            alias: deviceAlias,
            apiKey: await getApiKey(appId)
        };

        const result = await AxiosFactory.pnsApi
            .delete('/devices', body)
            .then((response) => response)
            .catch((error) => console.log(error));
        return result.data;
    },

    async changeDeviceStatus(appId, device) {
        if (AxiosFactory.debugMode) {
            return;
        }

        const url = `/devices/${device.status ? 'enable' : 'disable'}`;

        const body = {
            alias: device.alias,
            apiKey: await getApiKey(appId)
        };

        const result = await AxiosFactory.pnsApi
            .put(url, body)
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    }
};
