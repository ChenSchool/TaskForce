/**
 * API data source configuration module.
 * Configures axios instance with base URL and JWT token interceptor for authenticated requests.
 */
import axios from 'axios';

/** Base URL for all API requests. */
export const API_BASE = 'http://localhost:5000';

/** Axios instance with preconfigured base URL. */
const api = axios.create({
  baseURL: API_BASE,
});

/**
 * Request interceptor to automatically attach JWT access token to all outgoing requests.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;