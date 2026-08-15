import axios from 'axios';
import { getUserFriendlyMessage } from '@/lib/error-handler';

// Extend AxiosRequestConfig to support custom toast metadata
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    /** Custom success message shown in the toast after a successful mutation. */
    successMessage?: string;
    /** Set to true to suppress all toasts for this request. */
    skipToast?: boolean;
  }
}

const MUTATION_METHODS = new Set(['post', 'put', 'patch', 'delete']);

export const publicApi = axios.create({
  baseURL: '/api/proxy',
  timeout: 30000, // 30 seconds
});

publicApi.interceptors.response.use(
  (response) => {
    const method = response.config.method?.toLowerCase() ?? '';
    const skipToast = (response.config as any).skipToast;

    // Fire a success toast only for mutations (not GETs), unless silenced
    if (MUTATION_METHODS.has(method) && !skipToast) {
      const message =
        (response.config as any).successMessage ||
        getDefaultSuccessMessage(method);

      if (typeof (window as any).__showAdminToast === 'function') {
        (window as any).__showAdminToast('success', message);
      }
    }

    return response;
  },
  (error) => {
    const method = error.config?.method?.toLowerCase() ?? '';
    const skipToast = error.config?.skipToast;

    // Redirect to login on 401
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/login';
      }
    }

    // Fire an error toast for all failed requests unless silenced
    if (!skipToast) {
      const message = getUserFriendlyMessage(error);
      if (typeof (window as any).__showAdminToast === 'function') {
        (window as any).__showAdminToast('error', message);
      }
    }

    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/** Default success messages per HTTP method */
function getDefaultSuccessMessage(method: string): string {
  switch (method) {
    case 'post':   return 'Created successfully.';
    case 'put':
    case 'patch':  return 'Updated successfully.';
    case 'delete': return 'Deleted successfully.';
    default:       return 'Action completed successfully.';
  }
}

