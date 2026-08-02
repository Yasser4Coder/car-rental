import api from './client.js';

export const carApi = {
  getAll: (params) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return api.get(`/cars${query}`);
  },
  getById: (id) => api.get(`/cars/${id}`),
};

export const bookingApi = {
  getAll: () => api.get('/bookings'),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post('/bookings', data),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
};

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
};

export const userApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
};
