import axios from 'axios';

const api = axios.create({
  // For Docker environment, the browser requests go to localhost:8000
  // The frontend container communicates with backend container via Docker network
  baseURL: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:8000/api'  // For browser requests in development
    : 'http://app:8000/api',       // For production Docker network
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

// Add request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;