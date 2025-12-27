import api from '@/app/lib/api';

export interface MaintenanceStage {
  id: string;
  name: string;
  sequence: number;
  fold: boolean;
  isDone: boolean;
  isScrap: boolean;
  requestCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export async function getMaintenanceStages(): Promise<MaintenanceStage[]> {
  try {
    const response = await api.get<{ success: true; data: MaintenanceStage[] }>(
      '/maintenance-stages'
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function getMaintenanceStageById(id: string): Promise<MaintenanceStage> {
  try {
    const response = await api.get<{ success: true; data: MaintenanceStage }>(
      `/maintenance-stages/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export interface CreateMaintenanceStageData {
  name: string;
  sequence?: number;
  fold?: boolean;
  isDone?: boolean;
  isScrap?: boolean;
}

export async function createMaintenanceStage(
  data: CreateMaintenanceStageData
): Promise<MaintenanceStage> {
  try {
    const response = await api.post<{ success: true; data: MaintenanceStage }>(
      '/maintenance-stages',
      data
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

