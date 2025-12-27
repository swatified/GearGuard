import api from '@/app/lib/api';

export interface Department {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getDepartments(): Promise<Department[]> {
  try {
    const response = await api.get<{ success: true; data: Department[] }>('/departments');
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function getDepartmentById(id: string): Promise<Department> {
  try {
    const response = await api.get<{ success: true; data: Department }>(`/departments/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export interface CreateDepartmentData {
  name: string;
}

export async function createDepartment(data: CreateDepartmentData): Promise<Department> {
  try {
    const response = await api.post<{ success: true; data: Department }>('/departments', data);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export interface UpdateDepartmentData {
  name?: string;
}

export async function updateDepartment(id: string, data: UpdateDepartmentData): Promise<Department> {
  try {
    const response = await api.put<{ success: true; data: Department }>(
      `/departments/${id}`,
      data
    );
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function deleteDepartment(id: string): Promise<void> {
  try {
    await api.delete<{ success: true; message: string }>(`/departments/${id}`);
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

