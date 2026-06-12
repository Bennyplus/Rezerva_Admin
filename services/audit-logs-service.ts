import { publicApi } from '@/lib/api-client';

export const auditLogsService = {
  getAuditLogs: async () => {
    try {
      const response = await publicApi.get('', {
        // Fallback to path without api/v1 if needed, but start with standard structure
        params: { path: 'api/v1/admin/audit-logs/', }
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

  exportAuditLogs: async () => {
    try {
      const response = await publicApi.get('', {
        params: { path: 'api/v1/admin/audit-logs/', export: 'csv' },
        responseType: 'arraybuffer',
      });
      return response;
    } catch (error) {
      try {
        const fallbackResponse = await publicApi.get('', {
          params: { path: 'admin/audit-logs/', export: 'csv' },
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
