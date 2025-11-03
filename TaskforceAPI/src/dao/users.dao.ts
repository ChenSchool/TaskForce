import { OkPacket } from 'mysql';
import { execute } from '../services/mysql.connector';
import { User, UserDTO, RegisterRequest } from '../models/user.model';
import { usersQueries } from '../queries/users.queries';

export const getAllUsers = async () => {
  return execute<UserDTO[]>(usersQueries.getAllUsers, []);
};

export const getUserById = async (id: number) => {
  return execute<UserDTO[]>(usersQueries.getUserById, [id]);
};

export const getUserByUsername = async (username: string) => {
  return execute<User[]>(usersQueries.getUserByUsername, [username]);
};

export const getUserByEmail = async (email: string) => {
  return execute<User[]>(usersQueries.getUserByEmail, [email]);
};

export const createUser = async (data: RegisterRequest, passwordHash: string) => {
  return execute<OkPacket>(usersQueries.createUser, [
    data.username,
    passwordHash,
    data.name || null,
    data.email || null,
    data.role || 'Task Viewer'
  ]);
};

export const updateUser = async (id: number, name: string | null, email: string | null, role: string) => {
  return execute<OkPacket>(usersQueries.updateUser, [name, email, role, id]);
};

export const updateLastLogin = async (id: number) => {
  return execute<OkPacket>(usersQueries.updateLastLogin, [id]);
};

export const updatePassword = async (id: number, passwordHash: string) => {
  return execute<OkPacket>(usersQueries.updatePassword, [passwordHash, id]);
};

export const updateDarkMode = async (id: number, darkMode: boolean) => {
  return execute<OkPacket>(usersQueries.updateDarkMode, [darkMode, id]);
};

export const deactivateUser = async (id: number) => {
  return execute<OkPacket>(usersQueries.deactivateUser, [id]);
};

export const deleteUser = async (id: number) => {
  return execute<OkPacket>(usersQueries.deleteUser, [id]);
};

// Refresh token operations
export const saveRefreshToken = async (userId: number, token: string, expiresAt: Date) => {
  return execute<OkPacket>(usersQueries.saveRefreshToken, [userId, token, expiresAt]);
};

export const getRefreshToken = async (token: string) => {
  return execute<any[]>(usersQueries.getRefreshToken, [token]);
};

export const deleteRefreshToken = async (token: string) => {
  return execute<OkPacket>(usersQueries.deleteRefreshToken, [token]);
};

export const deleteUserRefreshTokens = async (userId: number) => {
  return execute<OkPacket>(usersQueries.deleteUserRefreshTokens, [userId]);
};
