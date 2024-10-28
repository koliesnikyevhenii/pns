export const MessageService = {
    getData(appId) {
        return {
            code: 0,
            data: [
                {
                    id: 12,
                    alias: 'RegisterExams',
                    lastMsg: 'Deep link to register exams tab in exams screen',
                    lastMsgStatus: 'Sent',
                    lastMsgDate: '26.12.2023',
                    msgCount: '12'
                }
            ]
        };
    },

    getMessages(appId) {
        return Promise.resolve(this.getData(appId));
    }
};
