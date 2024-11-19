import { ScheduleMode, SendMode } from '@/constants/enums';
import AxiosFactory from '@/service/AxiosFactory.js';
import messagesListStub from '@/stubs/messages.json';
import messageListByAlias from '@/stubs/messageByAlias.json';

export const MessageService = {
    async getMessages(apiKey) {
        if (AxiosFactory.debugMode) {
            return Promise.resolve(messagesListStub);
        }

        const body = {
            page: 0,
            pagesize: 100000,
            apiKey: apiKey
        };

        const result = await AxiosFactory.pnsApi
            .post('/messages/paging', body)
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    },

    async getMessagesByAlias(apiKey, deviceAlias) {
        if (AxiosFactory.debugMode) {
            return Promise.resolve(messageListByAlias);
        }

        const body = {
            apiKey: apiKey
        };

        const result = await AxiosFactory.pnsApi
            .post('/messages/alias', body, {
                params: { alias: deviceAlias }
            })
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    },

    async SendMessage(apiKey, messageData) {
        if (AxiosFactory.debugMode) {
            return Promise.resolve();
        }
        const { messageText, messagePayload, messageHeader, scheduleMode, messageSendDate, sendMode, messageTags, messageAliases } = messageData;

        const body = {
            apiKey: apiKey,
            message: {
                text: messageText,
                payload: this.parsePayload(messagePayload),
                ...(messageHeader && { header: messageHeader })
            },
            ...(scheduleMode === ScheduleMode.SCHEDULED && { schedual: { date: this.formatDate(messageSendDate) } }),
            ...this.buildCriteria(sendMode, messageTags, messageAliases)
        };

        const result = await AxiosFactory.pnsApi
            .post('/messages/send', body)
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    },
    parsePayload(payload) {
        try {
            return JSON.parse(payload);
        } catch (error) {
            console.error('Invalid JSON in message payload:', error);
            return {};
        }
    },
    formatDate(date) {
        const datePart = date.toLocaleDateString('en-CA');
        const timePart = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
        return `${datePart} ${timePart}`;
    },
    buildCriteria(sendMode, tags, aliases) {
        switch (sendMode) {
            case SendMode.TAG:
                return { criteria: { tag: tags } };
            case SendMode.ALIAS:
                return { criteria: { alias: aliases.split(/[, ]+/) } };
            default:
                return {};
        }
    }
};
