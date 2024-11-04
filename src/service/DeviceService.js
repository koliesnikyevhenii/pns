export const DeviceService = {
    getData() {
        return {
            recordsTotal: 3,
            recordsFiltered: 3,
            code: 0,
            data: [
                {
                    alias: '100100100',
                    deviceToken: 'b7b7159c11a5f9027018efb39f98d7462fddca0463c64a44d1fefb2f4815794f',
                    os: 2,
                    status: 1,
                    tags: ['INSTITUTION_SYMBOL:770875', 'INTERNAL', 'IOS_DEVICE']
                },
                {
                    alias: '001001001',
                    deviceToken: '1a012782daa01b17fe7bb44c11cd8e595f503aff625ad5bdd8ad89ea7da66606',
                    os: 2,
                    status: 1,
                    tags: ['INSTITUTION_SYMBOL:770875', 'INTERNAL', 'IOS_DEVICE']
                },
                {
                    alias: '036367001',
                    deviceToken: '80853e4a7093b5b40659e232459176b6d2b5ee2bca4d2a2075784bf13996397fb89470bc2454ef0b7383596e7963f89a8ab3fa8e815f604d7da98dc140b6bf347ac989f5448972fcde4b222a20709b5e',
                    os: 2,
                    status: 1,
                    tags: ['INSTITUTION_SYMBOL:770875', 'INTERNAL', 'IOS_DEVICE']
                }
            ]
        };
    },

    getDevices() {
        return Promise.resolve(this.getData());
    },

    deleteDevice(deviceAlias) {
        let payload = {
            alias: deviceAlias,
            apiKey: 'apiKey'
        };

        return Promise.resolve(payload);
    },

    changeDeviceStatus(device) {
        if (device.status) {
            console.log("Enable")
        } else {
            console.log("Disable");
        }
    }
};
