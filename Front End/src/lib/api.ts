import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // This enables cookies to be sent
});

// Request interceptor for auth tokens
api.interceptors.request.use(
  (config) => {
    // Since we're using HTTP-only cookies, we don't need to manually set the Authorization header
    // The cookie will be automatically sent with the request
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if we're not already on a login page and it's not an auth check
      const currentPath = window.location.pathname;
      const isAuthEndpoint = error.config?.url?.includes('/auth/me');
      const isLoginPage = currentPath.includes('login') || currentPath === '/admin' || currentPath === '/reseller';
      
      if (!isAuthEndpoint && !isLoginPage) {
        // Redirect to appropriate login based on current path
        if (currentPath.startsWith('/admin')) {
          window.location.href = '/admin';
        } else if (currentPath.startsWith('/reseller')) {
          window.location.href = '/reseller/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;