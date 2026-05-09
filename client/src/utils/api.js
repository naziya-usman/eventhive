import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Request interceptor: attach token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eventhive_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('eventhive_token');
      localStorage.removeItem('eventhive_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
