import { publicApi } from "@/lib/api-client";

export interface Permission {
  id: number;
  resource: string;
  action: string;
  codename: string;
}

export interface Role {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  permissions: Permission[];
  member_count?: number;
  is_active: boolean;
  created_at: string;
}

export interface RolesListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Role[];
}

export interface CreateRolePayload {
  name: string;
  description?: string;
  permission_ids: number[];
}

export const roleService = {
  /**
   * List Roles
   * GET administration/roles/
   */
  getRoles: async (page = 1, search = ""): Promise<RolesListResponse> => {
    try {
      const response = await publicApi.get("", {
        params: {
          path: "administration/roles/",
          page,
          ...(search && { search }),
        },
      });
      const data = response.data;
      if (data && Array.isArray(data.results)) {
        return data;
      }
      if (Array.isArray(data)) {
        return {
          count: data.length,
          next: null,
          previous: null,
          results: data,
        };
      }
      return {
        count: 0,
        next: null,
        previous: null,
        results: [],
      };
    } catch (error) {
      console.error("Failed to fetch roles:", error);
      throw error;
    }
  },

  /**
   * Create Role
   * POST administration/roles/
   */
  createRole: async (payload: CreateRolePayload): Promise<Role> => {
    try {
      const response = await publicApi.post("", payload, {
        params: {
          path: "administration/roles/",
        },
        successMessage: "Role created successfully",
      } as any);
      return response.data;
    } catch (error) {
      console.error("Failed to create role:", error);
      throw error;
    }
  },

  /**
   * Update Role
   * PUT administration/roles/?role_id={role_id}
   */
  updateRole: async (
    roleId: number | string,
    payload: CreateRolePayload
  ): Promise<Role> => {
    try {
      const response = await publicApi.put("", payload, {
        params: {
          path: "administration/roles/",
          role_id: roleId,
        },
        successMessage: "Role updated successfully",
      } as any);
      return response.data;
    } catch (error) {
      console.error(`Failed to update role ${roleId}:`, error);
      throw error;
    }
  },

  /**
   * Deactivate Role
   * PATCH administration/roles/deactivate/?role_id={role_id}
   */
  deactivateRole: async (roleId: number | string): Promise<any> => {
    try {
      const response = await publicApi.patch(
        "",
        {},
        {
          params: {
            path: "administration/roles/deactivate/",
            role_id: roleId,
          },
          successMessage: "Role deactivated successfully",
        } as any
      );
      return response.data;
    } catch (error) {
      console.error(`Failed to deactivate role ${roleId}:`, error);
      throw error;
    }
  },

  /**
   * Delete Role
   * DELETE administration/roles/?role_id={role_id}
   */
  deleteRole: async (roleId: number | string): Promise<any> => {
    try {
      const response = await publicApi.delete("", {
        params: {
          path: "administration/roles/",
          role_id: roleId,
        },
        successMessage: "Role deleted successfully",
      } as any);
      return response.data;
    } catch (error) {
      console.error(`Failed to delete role ${roleId}:`, error);
      throw error;
    }
  },

  /**
   * List Permissions
   * Attempts to fetch permissions from backend
   */
  getPermissions: async (): Promise<Permission[]> => {
    try {
      const response = await publicApi.get("", {
        params: { path: "administration/permissions/" },
        skipToast: true,
      } as any);
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.results)) return data.results;
      if (Array.isArray(data?.data)) return data.data;
    } catch (err) {
      // Try fallback endpoint
      try {
        const fallbackRes = await publicApi.get("", {
          params: { path: "api/v1/admin/permissions/" },
          skipToast: true,
        } as any);
        const fbData = fallbackRes.data;
        if (Array.isArray(fbData)) return fbData;
        if (Array.isArray(fbData?.results)) return fbData.results;
        if (Array.isArray(fbData?.data)) return fbData.data;
      } catch (fbErr) {
        // Silently return empty array if permissions endpoint is not present
      }
    }
    return [];
  },
};
