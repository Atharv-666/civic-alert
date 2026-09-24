import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Request Interceptor: Inject JWT token and role headers automatically
axiosInstance.interceptors.request.use((config) => {
  const isAdminRoute = window.location.pathname.startsWith('/admin') || config.url?.includes('/admin');

  if (isAdminRoute) {
    const adminToken = localStorage.getItem('admin_token');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    config.headers['X-User-Role'] = 'admin';
  } else {
    const userToken = localStorage.getItem('user_token');
    if (userToken) {
      config.headers.Authorization = `Bearer ${userToken}`;
    }
    config.headers['X-User-Role'] = 'user';
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Format clean error messages
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export default axiosInstance;
