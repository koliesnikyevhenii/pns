export const PayloadService = {
    getActionsRequest() {
        return {
            code: 0,
            data: [
                {
                    id: 12,
                    action: 'RegisterExams',
                    description: 'Deep link to register exams tab in exams screen'
                },
                {
                    id: 13,
                    action: 'PassedExams',
                    description: 'Deep link to passed exams tab in exams screen'
                },
                {
                    id: 14,
                    action: 'TestGrades',
                    description: 'Deep link to questionnaire tab in grades screen'
                },
                {
                    id: 15,
                    action: 'FinalGrades',
                    description: 'Deep link to final grades tab in grades screen'
                },
                {
                    id: 16,
                    action: 'Adjustments',
                    description: 'Deep link to adjustments screen'
                },
                {
                    id: 17,
                    action: 'Vacations',
                    description: 'Deep link to vacations screen'
                },
                {
                    id: 18,
                    action: 'Trips',
                    description: 'Deep link to trips screen'
                },
                {
                    id: 19,
                    action: 'Archive',
                    description: 'Deep link to archive screen'
                },
                {
                    id: 20,
                    action: 'Simulator',
                    description: 'Deep link to simulator screen'
                },
                {
                    id: 21,
                    action: 'Messages',
                    description: 'Deep link to messages screen'
                },
                {
                    id: 22,
                    action: 'Settings',
                    description: 'Deep link to messages screen'
                }
            ]
        };
    },

    getActions() {
        return Promise.resolve(this.getActionsRequest());
    }
};
