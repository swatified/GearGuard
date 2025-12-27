import api from '@/app/lib/api';

export interface MaintenanceTeam {
  id: string;
  name: string;
  active: boolean;
  members?: Array<{
    id: string;
    name: string;
    email?: string;
  }>;
  memberIds?: string[];
  requestCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MaintenanceTeamFilters {
  page?: number;
  limit?: number;
  active?: boolean;
  search?: string;
}

export interface MaintenanceTeamListResponse {
  teams: MaintenanceTeam[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function getMaintenanceTeams(
  filters?: MaintenanceTeamFilters
): Promise<MaintenanceTeamListResponse> {
  try {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.active !== undefined) params.append('active', filters.active.toString());
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get<{ success: true; data: MaintenanceTeamListResponse }>(
      `/maintenance-teams?${params.toString()}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function getMaintenanceTeamById(id: string): Promise<MaintenanceTeam> {
  try {
    const response = await api.get<{ success: true; data: MaintenanceTeam }>(
      `/maintenance-teams/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export interface CreateMaintenanceTeamData {
  name: string;
  memberIds?: string[];
  active?: boolean;
}

export async function createMaintenanceTeam(
  data: CreateMaintenanceTeamData
): Promise<MaintenanceTeam> {
  try {
    const response = await api.post<{ success: true; data: MaintenanceTeam }>(
      '/maintenance-teams',
      data
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export interface UpdateMaintenanceTeamData {
  name?: string;
  memberIds?: string[];
  active?: boolean;
}

export async function updateMaintenanceTeam(
  id: string,
  data: UpdateMaintenanceTeamData
): Promise<MaintenanceTeam> {
  try {
    const response = await api.put<{ success: true; data: MaintenanceTeam }>(
      `/maintenance-teams/${id}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function deleteMaintenanceTeam(id: string): Promise<void> {
  try {
    await api.delete<{ success: true; message: string }>(`/maintenance-teams/${id}`);
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

