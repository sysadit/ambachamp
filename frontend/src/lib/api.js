// src/lib/api.js
// Axios instance dengan auto-attach token dan error handling

import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: otomatis pasang token JWT di setiap request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('ambachamp_token');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: kalau 401 (token expired), auto logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('ambachamp_token');
      localStorage.removeItem('ambachamp_user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ─── Auth API calls ───────────────────────────────────────────────────────────
export const authAPI = {
  register: (data)        => api.post('/auth/register', data),
  login:    (data)        => api.post('/auth/login', data),
  getMe:    ()            => api.get('/auth/me'),
  updateProfile: (data)   => api.put('/auth/profile', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// ─── Lomba API calls ──────────────────────────────────────────────────────────
export const lombaAPI = {
  getAll:    (params)     => api.get('/lomba', { params }),
  getById:   (id)         => api.get(`/lomba/${id}`),
  getMyLomba: ()          => api.get('/lomba/my/list'),
  create:    (data)       => api.post('/lomba', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update:    (id, data)   => api.put(`/lomba/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete:    (id)         => api.delete(`/lomba/${id}`),
};

// ─── Wishlist API calls ───────────────────────────────────────────────────────
export const wishlistAPI = {
  getAll:    ()           => api.get('/wishlist'),
  add:       (lombaId)    => api.post(`/wishlist/${lombaId}`),
  remove:    (lombaId)    => api.delete(`/wishlist/${lombaId}`),
};

// ─── Teammate API calls ───────────────────────────────────────────────────────
export const teammateAPI = {
  getAll:    (params)     => api.get('/teammate', { params }),
  getById:   (id)         => api.get(`/teammate/${id}`),
  create:    (data)       => api.post('/teammate', data),
  close:     (id)         => api.put(`/teammate/${id}/close`),
  apply:     (postId, data) => api.post(`/teammate/${postId}/apply`, data),
  updateApp: (appId, data)  => api.put(`/teammate/applications/${appId}`, data),
};

// ─── Notifikasi API calls ─────────────────────────────────────────────────────
export const notifAPI = {
  getAll:     ()          => api.get('/notifikasi'),
  markRead:   (id)        => api.put(`/notifikasi/${id}/read`),
  markAllRead: ()         => api.put('/notifikasi/read-all'),
  delete:     (id)        => api.delete(`/notifikasi/${id}`),
};

// ─── Admin API calls ──────────────────────────────────────────────────────────
export const adminAPI = {
  getDashboard:   ()          => api.get('/admin/dashboard'),
  getAllLomba:     (params)    => api.get('/admin/lomba', { params }),
  getPendingLomba: ()         => api.get('/admin/lomba/pending'),
  verifyLomba:    (id, data)  => api.put(`/admin/lomba/${id}/verify`, data),
  getAllUsers:     (params)    => api.get('/admin/users', { params }),
  createUser:     (data)      => api.post('/admin/users', data),
  toggleUser:     (id)        => api.put(`/admin/users/${id}/toggle`),
};
