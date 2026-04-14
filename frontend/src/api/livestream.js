import axios from '../utils/axios';

const livestreamApi = {
    getAllCollections: () => axios.get('/livestreams'),
    getLive: () => axios.get('/livestreams/live'),
    getUpcoming: () => axios.get('/livestreams/upcoming'),
    getById: (id) => axios.get(`/livestreams/${id}`),
    getPopular: (limit = 10) => axios.get(`/livestreams/popular?limit=${limit}`),
};

export default livestreamApi;
