import api from '@/app/lib/api';

export interface Employee {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  department?: {
    id: string;
    name: string;
  };
  departmentId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function getEmployees(): Promise<Employee[]> {
  try {
    const response = await api.get<{ success: true; data: Employee[] }>('/employees');
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function getEmployeeById(id: string): Promise<Employee> {
  try {
    const response = await api.get<{ success: true; data: Employee }>(`/employees/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export interface CreateEmployeeData {
  name: string;
  email?: string;
  phone?: string;
  departmentId?: string;
}

export async function createEmployee(data: CreateEmployeeData): Promise<Employee> {
  try {
    const response = await api.post<{ success: true; data: Employee }>('/employees', data);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

