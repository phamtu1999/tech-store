import axios from '../utils/axios';

const stripWrapper = (promise) => promise.then(res => {
    if (res.data && Array.isArray(res.data.result)) {
        res.data.result = res.data.result.map(r => r.product ? r.product : r);
    }
    return res;
});

const recommendationsApi = {
    getPersonalized: (limit = 10) => stripWrapper(axios.get(`/recommendations/personalized?limit=${limit}`)),
    getSimilar: (productId, limit = 10) => stripWrapper(axios.get(`/recommendations/similar/${productId}?limit=${limit}`)),
    getPopular: (limit = 10) => stripWrapper(axios.get(`/recommendations/popular?limit=${limit}`)),
    getTrending: (limit = 10) => stripWrapper(axios.get(`/recommendations/trending?limit=${limit}`)),
    trackView: (productId) => axios.post(`/recommendations/track/view/${productId}`),
    trackClick: (productId) => axios.post(`/recommendations/track/click/${productId}`),
};

export default recommendationsApi;
