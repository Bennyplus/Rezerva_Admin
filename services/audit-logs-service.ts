import { publicApi } from '@/lib/api-client';

export const auditLogsService = {
  getAuditLogs: async (queryParams?: Record<string, any>) => {
    try {
      const response = await publicApi.get('', {
        params: { 
          path: 'api/v1/admin/audit-logs/',
          ...queryParams,
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAuditLogDetail: async (auditId: string) => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/audit-logs/info/', audit_id: auditId }
      });
      return response.data;
    } catch (error) {
      try {
        const fallbackResponse = await publicApi.get('', {
          params: { path: 'admin/audit-logs/info/', audit_id: auditId }
        });
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error(`Failed to fetch audit log detail for ${auditId}:`, fallbackError);
        throw fallbackError;
      }
    }
  },

  exportAuditLogs: async (format: string = 'csv') => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/audit-logs/', export: format },
        responseType: 'arraybuffer',
      });
      return response;
    } catch (error) {
      try {
        const fallbackResponse = await publicApi.get('', {
          params: { path: 'admin/audit-logs/', export: format },
          responseType: 'arraybuffer',
        });
        return fallbackResponse;
      } catch (fallbackError) {
        console.error('Failed to export audit logs:', fallbackError);
        throw fallbackError;
      }
    }
  }
};
