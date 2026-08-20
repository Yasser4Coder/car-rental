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
  getPopular: (limit = 6) => api.get(`/cars/popular?limit=${limit}`),
  getBySlug: (slugOrId) => api.get(`/cars/${encodeURIComponent(slugOrId)}`),
  /** @deprecated Prefer getBySlug — kept for booking forms that still pass numeric ids */
  getById: (id) => api.get(`/cars/${encodeURIComponent(id)}`),
  checkAvailability: (slugOrId, pickupDate, returnDate) => {
    const params = new URLSearchParams({ pickupDate });
    if (returnDate) params.set('returnDate', returnDate);
    return api.get(`/cars/${encodeURIComponent(slugOrId)}/availability?${params}`);
  },
};

export const bookingApi = {
  getMine: () => api.get('/bookings/mine'),
  create: (data) => api.post('/bookings', data),
  cancel: (id) => api.patch(`/bookings/${id}/cancel`),
};

export const paymentApi = {
  getConfig: () => api.get('/payments/config'),
  createCheckoutSession: (body) => api.post('/payments/checkout-session', body),
  checkoutStatus: (sessionId, email) => {
    const params = new URLSearchParams({ session_id: sessionId });
    if (email) params.set('email', email);
    return api.get(`/payments/checkout-status?${params}`);
  },
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
