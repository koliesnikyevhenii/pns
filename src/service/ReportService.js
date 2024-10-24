export const ReportService = {
    getData(appId) {
        return {
            code: 0,
            data: {
                results: [
                    {
                        Day: '26.12.2023 00:00:00',
                        TagName: 'INSTITUTION_SYMBOL:770875',
                        NumberOfMessageSent: '5',
                        PageNumber: '1'
                    },
                    {
                        Day: '26.12.2023 00:00:00',
                        TagName: 'INTERNAL',
                        NumberOfMessageSent: '5',
                        PageNumber: '1'
                    },
                    {
                        Day: '26.12.2023 00:00:00',
                        TagName: 'IOS_DEVICE',
                        NumberOfMessageSent: '5',
                        PageNumber: '1'
                    },
                    {
                        Day: '09.01.2024 00:00:00',
                        TagName: 'INSTITUTION_SYMBOL:770875',
                        NumberOfMessageSent: '6',
                        PageNumber: '1'
                    },
                    {
                        Day: '09.01.2024 00:00:00',
                        TagName: 'INTERNAL',
                        NumberOfMessageSent: '6',
                        PageNumber: '1'
                    },
                    {
                        Day: '09.01.2024 00:00:00',
                        TagName: 'IOS_DEVICE',
                        NumberOfMessageSent: '6',
                        PageNumber: '1'
                    },
                    {
                        Day: '10.01.2024 00:00:00',
                        TagName: 'INSTITUTION_SYMBOL:770875',
                        NumberOfMessageSent: '4',
                        PageNumber: '1'
                    },
                    {
                        Day: '10.01.2024 00:00:00',
                        TagName: 'INTERNAL',
                        NumberOfMessageSent: '4',
                        PageNumber: '1'
                    },
                    {
                        Day: '10.01.2024 00:00:00',
                        TagName: 'IOS_DEVICE',
                        NumberOfMessageSent: '4',
                        PageNumber: '1'
                    },
                    {
                        Day: '11.01.2024 00:00:00',
                        TagName: 'INSTITUTION_SYMBOL:770875',
                        NumberOfMessageSent: '12',
                        PageNumber: '1'
                    }
                ],
                pagesCount: 2,
                totalCount: 18
            }
        };
    },

    getMessageByTags(appId) {
        return Promise.resolve(this.getData(appId));
    }
};
