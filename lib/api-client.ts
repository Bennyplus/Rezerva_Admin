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
    
    // We optionally handle 401 locally if needed, but cookies are cleared by proxy
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }

    console.error('API Error:', message);
    return Promise.reject(error);
  }
);
