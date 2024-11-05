import axios from 'axios';
import devicesListStub from '@/stubs/devices.json';

const DEBUG_MODE = import.meta.env.VITE_DEBUG_MODE == 'true';

const axiosBase = axios.create({
    baseURL: import.meta.env.VITE_PNS_API_BASE_URL
});

export const DeviceService = {
    async getDevices(page, pageSize) {
        if (DEBUG_MODE) {
            return devicesListStub;
        }

        const body = {
            apiKey : "dbadec88-44bb-454b-b608-bddb4cd6ae6f",
            page: page,
            pageSize: pageSize
        }

        const result = await axiosBase
            .post('/devices/paging', body, {
                params: { includeTags: true }
            })
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    },

    async deleteDevice(deviceAlias) {
        if (DEBUG_MODE) {
            return;
        }

        const body = {
            alias: deviceAlias,
            apiKey: 'dbadec88-44bb-454b-b608-bddb4cd6ae6f'
        }

        const result = await axiosBase
            .delete('/devices', body)
            .then((response) => response)
            .catch((error) => console.log(error));
        return result.data;
    },

    async changeDeviceStatus(device) {
        if (DEBUG_MODE) {
            return;
        }

        const url = `/devices/${device.status ? 'enable' : 'disable'}`

        const body = {
            alias: device.alias,
            apiKey : "dbadec88-44bb-454b-b608-bddb4cd6ae6f",
        }

        const result = await axiosBase
            .put(url, body)
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    }
};
