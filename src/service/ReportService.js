import AxiosFactory from '@/service/AxiosFactory.js';
import reportListStub from '@/stubs/report.json';
import reportTypesStub from '@/stubs/reportTypes.json';

export const ReportService = {
    async getReports(apiKey, page, pageSize, reportId, searchString) {
        if (AxiosFactory.debugMode) {
            return Promise.resolve(reportListStub);
        }

        const body = {
            apiKey: apiKey,
            //Searching and sorting are not implemented on the backend,
            //so we retrieve the entire collection and perform sorting on the frontend.
            pageNumber: 1,
            pageSize: 100000,
            reportId: reportId,
            searchString: searchString
        };

        const result = await AxiosFactory.pnsApi
            .post('/reports', body)
            .then((response) => response)
            .catch((error) => console.log(error));

        return result.data;
    },

    async getReportTypes(apiKey) {
        if (AxiosFactory.debugMode) {
            return Promise.resolve(reportTypesStub);
        }
        const body = {
            apiKey: apiKey,
        };

        const resulst = await AxiosFactory.pnsApi
            .post('/reports/types', body)
            .then((response) => response)
            .catch((error) => console.log(error));

        return resulst.data;
    }
};
