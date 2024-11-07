import AxiosFactory from '@/service/AxiosFactory.js';
import devicesListStub from '@/stubs/devices.json';

export const DeviceService = {
    async getDevices(page, pageSize) {
        if (AxiosFactory.debugMode) {
            return Promise.resolve(devicesListStub);
        }

        const body = {
            apiKey : "dbadec88-44bb-454b-b608-bddb4cd6ae6f",
            page: page,
            pageSize: pageSize
        }

        const result = await AxiosFactory.pnsApi
            .post('/devices/paging', body, {
                params: { includeTags: true }
            })
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    },

    async deleteDevice(deviceAlias) {
        if (AxiosFactory.debugMode) {
            return;
        }

        const body = {
            alias: deviceAlias,
            apiKey: 'dbadec88-44bb-454b-b608-bddb4cd6ae6f'
        }

        const result = await AxiosFactory.pnsApi
            .delete('/devices', body)
            .then((response) => response)
            .catch((error) => console.log(error));
        return result.data;
    },

    async changeDeviceStatus(device) {
        if (AxiosFactory.debugMode) {
            return;
        }

        const url = `/devices/${device.status ? 'enable' : 'disable'}`

        const body = {
            alias: device.alias,
            apiKey : "dbadec88-44bb-454b-b608-bddb4cd6ae6f",
        }

        const result = await AxiosFactory.pnsApi
            .put(url, body)
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    }
};
