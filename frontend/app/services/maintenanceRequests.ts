import api from '@/app/lib/api';

export interface MaintenanceRequest {
  id: string;
  name: string;
  subject: string;
  description?: string;
  equipmentId: string;
  equipment?: {
    id: string;
    name: string;
    serialNumber?: string;
    location?: string;
    company?: string;
  };
  maintenanceTeamId?: string;
  maintenanceTeam?: {
    id: string;
    name: string;
    members?: Array<{ id: string; name: string }>;
  };
  categoryId?: string;
  category?: {
    id: string;
    name: string;
  };
  technicianId?: string;
  technician?: {
    id: string;
    name: string;
    email?: string;
  };
  userId?: string;
  user?: {
    id: string;
    name: string;
  };
  createdBy?: {
    id: string;
    name: string;
  };
  requestType: 'corrective' | 'preventive';
  priority?: string;
  scheduledDate?: string;
  dateRequest?: string;
  dateStart?: string;
  dateEnd?: string;
  duration?: number;
  maintenanceCost?: number;
  stageId?: string;
  stage?: {
    id: string;
    name: string;
    sequence?: number;
  };
  state: 'new' | 'in_progress' | 'repaired' | 'scrap';
  isOverdue?: boolean;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MaintenanceRequestFilters {
  page?: number;
  limit?: number;
  state?: string;
  requestType?: 'corrective' | 'preventive';
  equipmentId?: string;
  teamId?: string;
  technicianId?: string;
  isOverdue?: boolean;
  scheduledDateFrom?: string;
  scheduledDateTo?: string;
  search?: string;
}

export interface MaintenanceRequestListResponse {
  requests: MaintenanceRequest[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export async function getMaintenanceRequests(
  filters?: MaintenanceRequestFilters
): Promise<MaintenanceRequestListResponse> {
  try {
    const params = new URLSearchParams();
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.state) params.append('state', filters.state);
    if (filters?.requestType) params.append('requestType', filters.requestType);
    if (filters?.equipmentId) params.append('equipmentId', filters.equipmentId);
    if (filters?.teamId) params.append('teamId', filters.teamId);
    if (filters?.technicianId) params.append('technicianId', filters.technicianId);
    if (filters?.isOverdue !== undefined) params.append('isOverdue', filters.isOverdue.toString());
    if (filters?.scheduledDateFrom) params.append('scheduledDateFrom', filters.scheduledDateFrom);
    if (filters?.scheduledDateTo) params.append('scheduledDateTo', filters.scheduledDateTo);
    if (filters?.search) params.append('search', filters.search);

    const response = await api.get<{ success: true; data: MaintenanceRequestListResponse }>(
      `/maintenance-requests?${params.toString()}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function getMaintenanceRequestById(id: string): Promise<MaintenanceRequest> {
  try {
    const response = await api.get<{ success: true; data: MaintenanceRequest }>(
      `/maintenance-requests/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export interface CreateMaintenanceRequestData {
  subject: string;
  description?: string;
  equipmentId: string;
  requestType: 'corrective' | 'preventive';
  priority?: string;
  scheduledDate?: string;
  note?: string;
}

export async function createMaintenanceRequest(
  data: CreateMaintenanceRequestData
): Promise<MaintenanceRequest> {
  try {
    const response = await api.post<{ success: true; data: MaintenanceRequest }>(
      '/maintenance-requests',
      data
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export interface UpdateMaintenanceRequestData {
  subject?: string;
  description?: string;
  technicianId?: string;
  priority?: string;
  scheduledDate?: string;
  dateStart?: string;
  dateEnd?: string;
  duration?: number;
  maintenanceCost?: number;
  note?: string;
}

export async function updateMaintenanceRequest(
  id: string,
  data: UpdateMaintenanceRequestData
): Promise<MaintenanceRequest> {
  try {
    const response = await api.put<{ success: true; data: MaintenanceRequest }>(
      `/maintenance-requests/${id}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function assignTechnician(
  id: string,
  technicianId: string
): Promise<MaintenanceRequest> {
  try {
    const response = await api.patch<{ success: true; data: MaintenanceRequest }>(
      `/maintenance-requests/${id}/assign`,
      { technicianId }
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function updateRequestStage(id: string, stageId: string): Promise<MaintenanceRequest> {
  try {
    const response = await api.patch<{ success: true; data: MaintenanceRequest }>(
      `/maintenance-requests/${id}/stage`,
      { stageId }
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export interface CompleteRequestData {
  duration?: number;
  dateEnd?: string;
  maintenanceCost?: number;
  note?: string;
}

export async function completeRequest(
  id: string,
  data: CompleteRequestData
): Promise<MaintenanceRequest> {
  try {
    const response = await api.patch<{ success: true; data: MaintenanceRequest }>(
      `/maintenance-requests/${id}/complete`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function scrapRequest(id: string, scrapReason: string): Promise<MaintenanceRequest> {
  try {
    const response = await api.patch<{ success: true; data: MaintenanceRequest }>(
      `/maintenance-requests/${id}/scrap`,
      { scrapReason }
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function deleteMaintenanceRequest(id: string): Promise<void> {
  try {
    await api.delete<{ success: true; message: string }>(`/maintenance-requests/${id}`);
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export interface CalendarRequest {
  id: string;
  name: string;
  subject: string;
  scheduledDate: string;
  equipment: {
    id: string;
    name: string;
  };
  maintenanceTeam?: {
    id: string;
    name: string;
  };
  technician?: {
    id: string;
    name: string;
  };
  state: string;
  requestType: string;
}

export async function getCalendarRequests(filters?: {
  startDate?: string;
  endDate?: string;
  teamId?: string;
}): Promise<CalendarRequest[]> {
  try {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.teamId) params.append('teamId', filters.teamId);

    const response = await api.get<{ success: true; data: CalendarRequest[] }>(
      `/maintenance-requests/calendar?${params.toString()}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

