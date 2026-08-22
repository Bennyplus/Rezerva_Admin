import { publicApi } from '@/lib/api-client';

export const auditLogsService = {
  /**
   * Fetches audit logs list
   * GET administration/audit/logs/
   */
  getAuditLogs: async (queryParams?: Record<string, any>) => {
    try {
      const response = await publicApi.get('', {
        params: { 
          path: 'administration/audit/logs/',
          ...queryParams,
        }
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
      throw error;
    }
  },

  /**
   * Fetches single audit log detail
   * GET administration/audit/logs/?log_id={id}
   */
  getAuditLogDetail: async (auditId: string | number) => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'administration/audit/logs/', log_id: auditId }
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch audit log detail for ${auditId}:`, error);
      throw error;
    }
  },

  /**
   * Exports audit logs
   */
  exportAuditLogs: async (format: string = 'csv') => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'administration/audit/logs/', export: format },
        responseType: 'arraybuffer',
      });
      return response;
    } catch (error) {
      console.error('Failed to export audit logs:', error);
      throw error;
    }
  }
};
