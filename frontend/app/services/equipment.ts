import api from '@/app/lib/api';

export interface Equipment {
  id: string;
  name: string;
  serialNumber?: string;
  company?: string;
  model?: string;
  manufacturer?: string;
  technicalSpecifications?: string;
  purchaseDate?: string;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  location?: string;
  departmentId?: string;
  department?: {
    id: string;
    name: string;
  };
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
  employeeId?: string;
  employee?: {
    id: string;
    name: string;
  };
  maintenanceTeamId: string;
  maintenanceTeam?: {
    id: string;
    name: string;
  };
  technicianId?: string;
  technician?: {
    id: string;
    name: string;
    email?: string;
  };
  workCenterId?: string;
  workCenter?: {
    id: string;
    name: string;
  };
  active: boolean;
  requestCount?: number;
  openRequestCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EquipmentFilters {
  page?: number;
  limit?: number;
  active?: boolean;
  departmentId?: string;
  employeeId?: string;
  teamId?: string;
  search?: string;
}

export interface EquipmentListResponse {
  equipment: Equipment[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function getEquipment(filters?: EquipmentFilters): Promise<EquipmentListResponse> {
  try {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.active !== undefined) params.append('active', filters.active.toString());
    if (filters?.departmentId) params.append('departmentId', filters.departmentId);
    if (filters?.employeeId) params.append('employeeId', filters.employeeId);
    if (filters?.teamId) params.append('teamId', filters.teamId);
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get<{ success: true; data: EquipmentListResponse }>(
      `/equipment?${params.toString()}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function getEquipmentById(id: string): Promise<Equipment> {
  try {
    const response = await api.get<{ success: true; data: Equipment }>(`/equipment/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export interface CreateEquipmentData {
  name: string;
  serialNumber?: string;
  company?: string;
  model?: string;
  manufacturer?: string;
  technicalSpecifications?: string;
  purchaseDate?: string;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  location?: string;
  departmentId?: string;
  categoryId?: string;
  employeeId?: string;
  maintenanceTeamId: string;
  technicianId?: string;
  workCenterId?: string;
  note?: string;
}

export async function createEquipment(data: CreateEquipmentData): Promise<Equipment> {
  try {
    const response = await api.post<{ success: true; data: Equipment }>('/equipment', data);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export interface UpdateEquipmentData {
  name?: string;
  serialNumber?: string;
  company?: string;
  model?: string;
  manufacturer?: string;
  technicalSpecifications?: string;
  purchaseDate?: string;
  warrantyStartDate?: string;
  warrantyEndDate?: string;
  location?: string;
  departmentId?: string;
  categoryId?: string;
  employeeId?: string;
  maintenanceTeamId?: string;
  technicianId?: string;
  workCenterId?: string;
  active?: boolean;
  note?: string;
}

export async function updateEquipment(id: string, data: UpdateEquipmentData): Promise<Equipment> {
  try {
    const response = await api.put<{ success: true; data: Equipment }>(`/equipment/${id}`, data);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function deleteEquipment(id: string): Promise<void> {
  try {
    await api.delete<{ success: true; message: string }>(`/equipment/${id}`);
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export interface EquipmentRequestsResponse {
  equipment: {
    id: string;
    name: string;
  };
  requests: Array<{
    id: string;
    name: string;
    subject: string;
    requestType: string;
    state: string;
    scheduledDate: string;
    technician?: {
      id: string;
      name: string;
    };
    createdAt: string;
  }>;
  total: number;
  openCount: number;
}

export async function getEquipmentRequests(
  id: string,
  filters?: { state?: string; requestType?: string }
): Promise<EquipmentRequestsResponse> {
  try {
    const params = new URLSearchParams();
    if (filters?.state) params.append('state', filters.state);
    if (filters?.requestType) params.append('requestType', filters.requestType);

    const response = await api.get<{ success: true; data: EquipmentRequestsResponse }>(
      `/equipment/${id}/requests?${params.toString()}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

