export const ApplicationService = {
    getData(id) {
        return {
            applicationName: 'MOE Students',
            description: 'Test',
            apiKey: 'dbadec88-44bb-454b-b608-bddb4cd6ae6f'
        };
    },

    getApplication(id) {
        return Promise.resolve(this.getData());
    }
};
