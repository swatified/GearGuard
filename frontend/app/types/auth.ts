export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'technician' | 'manager' | 'admin';
  maintenanceTeamIds?: string[];
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'technician' | 'manager' | 'admin';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  details?: {
    fields?: Record<string, string>;
  };
}

