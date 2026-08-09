import api from './client.js';

export const carApi = {
  getAll: (params = {}) => {
    const cleaned = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== 'any'),
    );
    const query = Object.keys(cleaned).length ? `?${new URLSearchParams(cleaned)}` : '';
    return api.get(`/cars${query}`);
  },
  getFeatured: (limit = 12) => api.get(`/cars/featured?limit=${limit}`),
  getById: (id) => api.get(`/cars/${id}`),
};

export const bookingApi = {
  getMine: () => api.get('/bookings/mine'),
  create: (data) => api.post('/bookings', data),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
};

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout', {}),
  refresh: () => api.post('/auth/refresh', {}),
};

export const userApi = {
  getProfile: () => api.get('/users/me'),
  updateProfile: (data) => api.put('/users/me', data),
};
