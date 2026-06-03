import { publicApi } from '@/lib/api-client';

export const teamService = {
    getPermissions: async () => {
        try {
            const res = await publicApi.get("api/v1/admin/permissions/");
            return res.data;
        } catch (error) {
            throw error;
        }

    },

    getRoles: async () => {
        try {
            const res = await publicApi.get("api/v1/admin/permissions/");
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    // Create team (POST)
    createTeam: async (payload: FormData) => {
        const response = await publicApi.post("api/v1/staff-management/manage/", payload);
        return response.data;
    },

    // Update team (PUT)
    updateTeam: async (staffId: number, payload: FormData) => {
        const response = await publicApi.put(`api/v1/staff-management/manage/${staffId}/`, payload);
        return response.data;
    },

    // Delete team (DELETE)
    deleteTeam: async (staffId: number) => {
        const response = await publicApi.delete(`api/v1/staff-management/manage/${staffId}/`);
        return response.data;
    }
}   