import api from '@/app/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  department?: {
    id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export async function getUserById(id: string): Promise<User> {
  try {
    const response = await api.get<{ success: true; data: User }>(`/users/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

export async function getUsers(): Promise<User[]> {
  try {
    const response = await api.get<{ success: true; data: User[] }>('/users');
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
}

