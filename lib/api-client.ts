import axios from 'axios';

const BASE_URL = 'https://drifully-backend-1qa6.onrender.com/';

export const publicApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Increased timeout slightly
  headers: {
    'X-API-KEY': 'P5aatlVl.cVaYDgzZzSyztw8afqNzv0y6PyQ4yYau',
    'Accept': 'application/json',
  },
});

// Response interceptor for better error handling
publicApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // You can handle global errors here
    const message = error.response?.data?.message || error.message || 'An unexpected error occurred';
    console.error('API Error:', message);
    return Promise.reject(error);
  }
);
