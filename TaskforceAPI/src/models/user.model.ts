export type UserRole = 'Production Lead' | 'Supervisor' | 'Manager' | 'Task Viewer';

export interface User {
  id: number;
  username: string;
  password: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
  last_login: Date | null;
  is_active: boolean;
  dark_mode: boolean;
}

export interface UserDTO {
  id: number;
  username: string;
  name: string | null;
  email: string | null;
  role: UserRole;
  created_at: Date;
  last_login: Date | null;
  is_active: boolean;
  dark_mode: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
}
