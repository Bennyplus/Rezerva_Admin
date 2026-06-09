import axios from 'axios';

export const publicApi = axios.create({
  baseURL: '/api/proxy',
  timeout: 30000,   // 30 seconds
});

publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }

    console.error('API Error:', message);
    return Promise.reject(error);
  }
);
