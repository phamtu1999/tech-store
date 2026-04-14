import axios from '../utils/axios';

const recommendationsApi = {
    getPersonalized: (limit = 10) => axios.get(`/recommendations/user?limit=${limit}`),
    getSimilar: (productId, limit = 10) => axios.get(`/recommendations/similar/${productId}?limit=${limit}`),
    getPopular: (limit = 10) => axios.get(`/recommendations/popular?limit=${limit}`),
    getTrending: (limit = 10) => axios.get(`/recommendations/trending?limit=${limit}`),
    trackView: (productId) => axios.post(`/recommendations/track/view/${productId}`),
    trackClick: (productId) => axios.post(`/recommendations/track/click/${productId}`),
};

export default recommendationsApi;
