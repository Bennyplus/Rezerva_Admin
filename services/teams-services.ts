import { publicApi } from '@/lib/api-client';

export const teamService = {
    getPermissions: async () => {
        try {
            const res = await publicApi.get("", {
                params: { path: 'api/v1/admin/permissions/' }
            });
            return res.data;
        } catch (error) {
            throw error;
        }

    },

    getRoles: async () => {
        try {
            const res = await publicApi.get("", {
                params: { path: 'api/v1/admin/roles/' }
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    },

    // Create team (POST)
    createTeam: async (payload: FormData) => {
        const response = await publicApi.post("", payload, {
            params: { path: 'api/v1/staff-management/manage/' }
        });
        return response.data;
    },

    // Update team (PUT)
    updateTeam: async (staffId: number, payload: FormData) => {
        const response = await publicApi.put("", payload, {
            params: { path: `api/v1/staff-management/manage/${staffId}/` }
        });
        return response.data;
    },

    // Delete team (DELETE)
    deleteTeam: async (staffId: number) => {
        const response = await publicApi.delete("", {
            params: { path: `api/v1/staff-management/manage/${staffId}/` }
        });
        return response.data;
    }
}   