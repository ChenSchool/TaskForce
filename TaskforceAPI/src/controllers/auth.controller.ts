import { Request, Response } from 'express';
import * as UsersDao from '../dao/users.dao';
import * as AuthUtils from '../utils/auth.utils';
import { LoginRequest, RegisterRequest, UserDTO } from '../models/user.model';
import { AuthRequest } from '../middleware/auth.middleware';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: RegisterRequest = req.body;

    // Validation
    if (!data.username || !data.password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    // Check if user already exists
    const existingUser = await UsersDao.getUserByUsername(data.username);
    if (existingUser && existingUser.length > 0) {
      res.status(409).json({ message: 'Username already exists' });
      return;
    }

    if (data.email) {
      const existingEmail = await UsersDao.getUserByEmail(data.email);
      if (existingEmail && existingEmail.length > 0) {
        res.status(409).json({ message: 'Email already exists' });
        return;
      }
    }

    // Hash password
    const passwordHash = await AuthUtils.hashPassword(data.password);

    // Create user
    const result = await UsersDao.createUser(data, passwordHash);
    const userId = result.insertId;
    const [user] = await UsersDao.getUserById(userId);

    if (!user) {
      res.status(500).json({ message: 'Failed to create user' });
      return;
    }

    // Generate tokens
    const accessToken = AuthUtils.generateAccessToken(user);
    const refreshToken = AuthUtils.generateRefreshToken(user);

    // Save refresh token
    await UsersDao.saveRefreshToken(user.id, refreshToken, AuthUtils.getRefreshTokenExpiry());

    res.status(201).json({
      user,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('[auth.controller][register][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password }: LoginRequest = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }

    // Get user
    const users = await UsersDao.getUserByUsername(username);
    if (!users || users.length === 0) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const user = users[0];

    // Verify password
    const isValid = await AuthUtils.comparePassword(password, user.password);
    if (!isValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Update last login
    await UsersDao.updateLastLogin(user.id);

    // Remove password from response
    const { password: _, ...userDTO } = user;

    // Generate tokens
    const accessToken = AuthUtils.generateAccessToken(userDTO as UserDTO);
    const refreshToken = AuthUtils.generateRefreshToken(userDTO as UserDTO);

    // Save refresh token
    await UsersDao.saveRefreshToken(user.id, refreshToken, AuthUtils.getRefreshTokenExpiry());

    res.json({
      user: userDTO,
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error('[auth.controller][login][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ message: 'Refresh token is required' });
      return;
    }

    // Verify refresh token
    const decoded = AuthUtils.verifyRefreshToken(refreshToken);
    if (!decoded) {
      res.status(401).json({ message: 'Invalid refresh token' });
      return;
    }

    // Check if token exists in database
    const tokenRecords = await UsersDao.getRefreshToken(refreshToken);
    if (!tokenRecords || tokenRecords.length === 0) {
      res.status(401).json({ message: 'Refresh token not found' });
      return;
    }

    // Get user
    const users = await UsersDao.getUserById(decoded.id);
    if (!users || users.length === 0) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    const user = users[0];

    // Generate new tokens
    const newAccessToken = AuthUtils.generateAccessToken(user);
    const newRefreshToken = AuthUtils.generateRefreshToken(user);

    // Delete old refresh token and save new one
    await UsersDao.deleteRefreshToken(refreshToken);
    await UsersDao.saveRefreshToken(user.id, newRefreshToken, AuthUtils.getRefreshTokenExpiry());

    res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    console.error('[auth.controller][refreshToken][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await UsersDao.deleteRefreshToken(refreshToken);
    }

    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('[auth.controller][logout][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    const users = await UsersDao.getUserById(req.user.id);
    if (!users || users.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(users[0]);
  } catch (error) {
    console.error('[auth.controller][getCurrentUser][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
