/**
 * User model type definitions.
 * Defines user roles, authentication structures, and data transfer objects for user management.
 */
export type UserRole = 'Production Lead' | 'Supervisor' | 'Manager' | 'Task Viewer';

/** Complete user entity including password hash for database operations. */
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

/** User data transfer object excluding sensitive password information. */
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

/** Login request payload with credentials. */
export interface LoginRequest {
  username: string;
  password: string;
}

/** Registration request payload for creating new users. */
export interface RegisterRequest {
  username: string;
  password: string;
  name?: string;
  email?: string;
  role?: UserRole;
}

/** Authentication response containing user data and JWT tokens. */
export interface AuthResponse {
  user: UserDTO;
  accessToken: string;
  refreshToken: string;
}
