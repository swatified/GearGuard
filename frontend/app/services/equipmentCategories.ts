import api from '@/app/lib/api';

export interface EquipmentCategory {
  id: string;
  name: string;
  responsible?: {
    id: string;
    name: string;
    email?: string;
  } | null;
  description?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function getEquipmentCategories(): Promise<EquipmentCategory[]> {
  try {
    const response = await api.get<{ success: true; data: EquipmentCategory[] }>(
      '/equipment-categories'
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function getEquipmentCategoryById(id: string): Promise<EquipmentCategory> {
  try {
    const response = await api.get<{ success: true; data: EquipmentCategory }>(
      `/equipment-categories/${id}`
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export interface CreateEquipmentCategoryData {
  name: string;
  responsible?: string;
  description?: string;
  active?: boolean;
}

export async function createEquipmentCategory(
  data: CreateEquipmentCategoryData
): Promise<EquipmentCategory> {
  try {
    const response = await api.post<{ success: true; data: EquipmentCategory }>(
      '/equipment-categories',
      data
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export interface UpdateEquipmentCategoryData {
  name?: string;
  responsible?: string;
  description?: string;
  active?: boolean;
}

export async function updateEquipmentCategory(
  id: string,
  data: UpdateEquipmentCategoryData
): Promise<EquipmentCategory> {
  try {
    const response = await api.put<{ success: true; data: EquipmentCategory }>(
      `/equipment-categories/${id}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function deleteEquipmentCategory(id: string): Promise<void> {
  try {
    await api.delete<{ success: true; message: string }>(`/equipment-categories/${id}`);
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

