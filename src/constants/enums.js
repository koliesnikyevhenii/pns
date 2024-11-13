export const SendMode = Object.freeze({
    EVERYONE: '1',
    TAG: '2',
    ALIAS: '3'
});

export const ScheduleMode = Object.freeze({
    IMMEDIATELY: '1',
    SCHEDULED: '2',
});

export const MessageStatuses= {
    [-1]: 'Scheduled',
    [0]: 'New',
    [1]: 'Enqueued',
    [2]: 'Sending',
    [3]: 'Sent',
    [4]: 'Failed'
};

