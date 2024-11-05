import axios from 'axios';

export default {
    debugMode: import.meta.env.VITE_DEBUG_MODE == 'true',

    pnsApi: axios.create({
        baseURL: import.meta.env.VITE_PNS_API_BASE_URL
        //withCredentials: true //TODO: api authorization
    })
};
