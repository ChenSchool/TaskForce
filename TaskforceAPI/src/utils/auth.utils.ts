/**
 * Authentication utilities module.
 * Provides functions for password hashing, JWT token generation/verification, and token expiry management.
 */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserDTO } from '../models/user.model';

/** JWT secret key for access token signing. */
const JWT_SECRET = process.env.JWT_SECRET || 'taskforce-secret-key-change-in-production';

/** JWT secret key for refresh token signing. */
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'taskforce-refresh-secret-change-in-production';

/** Access token expiration time (15 minutes). */
const ACCESS_TOKEN_EXPIRY = '15m';

/** Refresh token expiration time (7 days). */
const REFRESH_TOKEN_EXPIRY = '7d';

/** Hash a password using bcrypt with 10 salt rounds. */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

/** Compare a plain text password with a bcrypt hash. */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/** Generate a JWT access token with user data and short expiration. */
export const generateAccessToken = (user: UserDTO): string => {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
};

/** Generate a JWT refresh token with minimal user data and long expiration. */
export const generateRefreshToken = (user: UserDTO): string => {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
};

/** Verify and decode a JWT access token, returning null if invalid. */
export const verifyAccessToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/** Verify and decode a JWT refresh token, returning null if invalid. */
export const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

/** Calculate the expiration date for a new refresh token (7 days from now). */
export const getRefreshTokenExpiry = (): Date => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  return expiry;
};
