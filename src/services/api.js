import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/',
  withCredentials: true,
});
console.log(import.meta.env.VITE_API_URL);


// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 → logout
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('pb_user');
      localStorage.removeItem('pb_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

/* ========================
   AUTH
======================== */
export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login:    (data) => api.post('/api/auth/login', data),
  logout:   ()     => api.post('/api/auth/logout'),
  forgotPassword: (email) => api.post('/api/auth/forgot-password', { email }),
  verifyResetCode: (email, token) => api.post('/api/auth/verify-reset-code', { email, token }),
  resetPassword:  (data)  => api.post('/api/auth/reset-password', data),
};

/* ========================
   USER
======================== */
export const userAPI = {
  getProfile:    ()     => api.get('/api/users/profile'),
  updateProfile: (data) => api.put('/api/users/profile', data),
  changePassword:(data) => api.put('/api/users/change-password', data),
  uploadAvatar:  (file) => {
    const fd = new FormData();
    fd.append('avatar', file);
    return api.put('/api/users/avatar', fd);
  },
};

/* ========================
   PORTFOLIOS
======================== */
export const portfolioAPI = {
  getAll:    (params) => api.get('/api/portfolios', { params }),
  getOne:    (id)     => api.get(`/api/portfolios/${id}`),
  create:    (data)   => api.post('/api/portfolios', data),
  update:    (id, data) => api.put(`/api/portfolios/${id}`, data),
  delete:    (id)     => api.delete(`/api/portfolios/${id}`),
  duplicate: (id)     => api.post(`/api/portfolios/${id}/duplicate`),
  uploadProfileImage: (id, file) => {
    const fd = new FormData();
    fd.append('profileImage', file);
    return api.put(`/api/portfolios/${id}/upload/profile-image`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadProjectImage: (id, projId, file) => {
    const fd = new FormData();
    fd.append('projectImage', file);
    return api.put(`/api/portfolios/${id}/upload/project/${projId}`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

/* ========================
   TEMPLATES
======================== */
export const templateAPI = {
  getAll:   (params) => api.get('/api/templates', { params }),
  getOne:   (id)     => api.get(`/api/templates/${id}`),
};

/* ========================
   DOWNLOADS
======================== */
export const downloadAPI = {
  generate: (portfolioId) => api.post(`/api/downloads/generate/${portfolioId}`),
  getHistory: (params)    => api.get('/api/downloads/history', { params }),
  download:   (id)        => api.get(`/api/downloads/${id}`, { responseType: 'blob' }),
  deleteHistory: (id)     => api.delete(`/api/downloads/history/${id}`),
};

/* ========================
   ADMIN
======================== */
export const adminAPI = {
  getStats:      ()           => api.get('/api/admin/stats'),
  getUsers:      (params)     => api.get('/api/admin/users', { params }),
  updateUser:    (id, data)   => api.put(`/api/admin/users/${id}`, data),
  deleteUser:    (id)         => api.delete(`/api/admin/users/${id}`),
  getTemplates:  (params)     => api.get('/api/admin/templates', { params }),
  createTemplate:(data)       => api.post('/api/admin/templates', data),
  updateTemplate:(id, data)   => api.put(`/api/admin/templates/${id}`, data),
  deleteTemplate:(id)         => api.delete(`/api/admin/templates/${id}`),
  getAnalytics:  ()           => api.get('/api/admin/analytics'),
};

export default api;
