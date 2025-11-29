/**
 * Users data access object (DAO) module.
 * Provides database operations for user management including CRUD, authentication, and refresh token handling.
 */
import { OkPacket } from 'mysql';
import { execute } from '../services/mysql.connector';
import { User, UserDTO, RegisterRequest } from '../models/user.model';
import { usersQueries } from '../queries/users.queries';

/** Fetch all users with public data (excludes password hash). */
export const getAllUsers = async () => {
  return execute<UserDTO[]>(usersQueries.getAllUsers, []);
};

/** Fetch a user by ID. */
export const getUserById = async (id: number) => {
  return execute<UserDTO[]>(usersQueries.getUserById, [id]);
};

/** Fetch a user by username (includes password for authentication). */
export const getUserByUsername = async (username: string) => {
  return execute<User[]>(usersQueries.getUserByUsername, [username]);
};

/** Fetch a user by email address. */
export const getUserByEmail = async (email: string) => {
  return execute<User[]>(usersQueries.getUserByEmail, [email]);
};

/** Create a new user with hashed password. */
export const createUser = async (data: RegisterRequest, passwordHash: string) => {
  return execute<OkPacket>(usersQueries.createUser, [
    data.username,
    passwordHash,
    data.name || null,
    data.email || null,
    data.role || 'Task Viewer'
  ]);
};

/** Update user profile information. */
export const updateUser = async (id: number, name: string | null, email: string | null, role: string) => {
  return execute<OkPacket>(usersQueries.updateUser, [name, email, role, id]);
};

/** Update user's last login timestamp. */
export const updateLastLogin = async (id: number) => {
  return execute<OkPacket>(usersQueries.updateLastLogin, [id]);
};

/** Update user's password hash. */
export const updatePassword = async (id: number, passwordHash: string) => {
  return execute<OkPacket>(usersQueries.updatePassword, [passwordHash, id]);
};

/** Update user's dark mode preference. */
export const updateDarkMode = async (id: number, darkMode: boolean) => {
  return execute<OkPacket>(usersQueries.updateDarkMode, [darkMode, id]);
};

/** Deactivate a user account (soft delete). */
export const deactivateUser = async (id: number) => {
  return execute<OkPacket>(usersQueries.deactivateUser, [id]);
};

/** Permanently delete a user from the database. */
export const deleteUser = async (id: number) => {
  return execute<OkPacket>(usersQueries.deleteUser, [id]);
};

// Refresh token operations

/** Save a refresh token to the database. */
export const saveRefreshToken = async (userId: number, token: string, expiresAt: Date) => {
  return execute<OkPacket>(usersQueries.saveRefreshToken, [userId, token, expiresAt]);
};

/** Retrieve a refresh token from the database. */
export const getRefreshToken = async (token: string) => {
  return execute<any[]>(usersQueries.getRefreshToken, [token]);
};

/** Delete a specific refresh token. */
export const deleteRefreshToken = async (token: string) => {
  return execute<OkPacket>(usersQueries.deleteRefreshToken, [token]);
};

/** Delete all refresh tokens for a specific user. */
export const deleteUserRefreshTokens = async (userId: number) => {
  return execute<OkPacket>(usersQueries.deleteUserRefreshTokens, [userId]);
};
