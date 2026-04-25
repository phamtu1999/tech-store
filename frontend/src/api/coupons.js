import axios from '../utils/axios';

const adminApi = {
    getAll: (params) => axios.get('/admin/coupons', { params }),
    getById: (id) => axios.get(`/admin/coupons/${id}`),
    create: (data) => axios.post('/admin/coupons', data),
    update: (id, data) => axios.put(`/admin/coupons/${id}`, data),
    delete: (id) => axios.delete(`/admin/coupons/${id}`)
};

const publicApi = {
    validate: (code, subTotal) => axios.get('/coupons/validate', { params: { code, orderValue: subTotal } })
};

export const couponApi = {
    admin: adminApi,
    public: publicApi
};
