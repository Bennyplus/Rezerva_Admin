import axios from 'axios';

export const publicApi = axios.create({
  baseURL: '/api/proxy',
  timeout: 20000,
});

// Response interceptor for better error handling
publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);
