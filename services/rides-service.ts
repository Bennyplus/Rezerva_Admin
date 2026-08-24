import { publicApi } from '@/lib/api-client';

export const ridesService = {
  /**
   * Fetches the administration rides / trips list
   * GET api/v1/admin/rides/
   */
  getRides: async (page: number = 1, filters?: Record<string, string>): Promise<any> => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/rides/', page, ...filters }
      });
      return response.data;
    } catch (error) {
      console.warn('Backend rides API not yet available or failed, using local dataset fallback');
      return null;
    }
  },

  /**
   * Fetches ride metrics
   * GET api/v1/admin/rides/metrics/
   */
  getMetrics: async (): Promise<any> => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/rides/metrics/' }
      });
      return response.data;
    } catch (error) {
      console.warn('Backend ride metrics API not yet available or failed');
      return null;
    }
  },
};
