import api from '@/app/lib/api';
import type { RegisterRequest, LoginRequest, AuthResponse, User, ApiError } from '@/app/types/auth';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await api.post<{ success: true; data: AuthResponse }>('/auth/register', data);
    
    if (response.data.success && response.data.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, response.data.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.data.user));
      }
      return response.data.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    const apiError: ApiError = error.response?.data || {
      success: false,
      error: 'Network Error',
      message: error.message || 'An unexpected error occurred',
    };
    throw apiError;
  }
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  try {
    const response = await api.post<{ success: true; data: AuthResponse }>('/auth/login', data);
    
    if (response.data.success && response.data.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, response.data.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.data.user));
      }
      return response.data.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    const apiError: ApiError = error.response?.data || {
      success: false,
      error: 'Network Error',
      message: error.message || 'An unexpected error occurred',
    };
    throw apiError;
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    const response = await api.get<{ success: true; data: User }>('/auth/me');
    
    if (response.data.success && response.data.data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.data));
      }
      return response.data.data;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    const apiError: ApiError = error.response?.data || {
      success: false,
      error: 'Network Error',
      message: error.message || 'An unexpected error occurred',
    };
    throw apiError;
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  }
}

export async function refreshToken(): Promise<string> {
  try {
    const response = await api.post<{ success: true; data: { token: string } }>('/auth/refresh');
    
    if (response.data.success && response.data.data?.token) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, response.data.data.token);
      }
      return response.data.data.token;
    }
    
    throw new Error('Invalid response format');
  } catch (error: any) {
    const apiError: ApiError = error.response?.data || {
      success: false,
      error: 'Network Error',
      message: error.message || 'An unexpected error occurred',
    };
    throw apiError;
  }
}

export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr) as User;
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getStoredToken();
}

