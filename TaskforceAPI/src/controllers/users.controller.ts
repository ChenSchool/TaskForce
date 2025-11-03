import { Response } from 'express';
import * as UsersDao from '../dao/users.dao';
import * as AuthUtils from '../utils/auth.utils';
import { AuthRequest } from '../middleware/auth.middleware';
import { RegisterRequest } from '../models/user.model';

export const createUser = async (req: AuthRequest, res: Response): Promise<void> => {
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

    // Return the created user (without generating tokens)
    res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error('[users.controller][createUser][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await UsersDao.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('[users.controller][getAll][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const users = await UsersDao.getUserById(id);

    if (!users || users.length === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(users[0]);
  } catch (error) {
    console.error('[users.controller][getById][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { name, email, role } = req.body;

  // Only allow users to update themselves unless they're manager/supervisor
  if (req.user?.role !== 'Manager' && req.user?.role !== 'Supervisor' && req.user?.id !== id) {
    res.status(403).json({ message: 'Insufficient permissions' });
    return;
  }

  // Only managers and supervisors can change roles
  if (role && req.user?.role !== 'Manager' && req.user?.role !== 'Supervisor') {
    res.status(403).json({ message: 'Only managers and supervisors can change user roles' });
    return;
  }    const result = await UsersDao.updateUser(id, name, email, role);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const updatedUsers = await UsersDao.getUserById(id);
    res.json(updatedUsers[0]);
  } catch (error) {
    console.error('[users.controller][update][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { currentPassword, newPassword } = req.body;

    // Only allow users to change their own password unless they're manager/supervisor
    if (req.user?.role !== 'Manager' && req.user?.role !== 'Supervisor' && req.user?.id !== id) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }

    if (!newPassword) {
      res.status(400).json({ message: 'New password is required' });
      return;
    }

    // If not manager/supervisor, verify current password
    if (req.user?.role !== 'Manager' && req.user?.role !== 'Supervisor') {
      const users = await UsersDao.getUserByUsername(req.user!.username);
      if (!users || users.length === 0) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const user = users[0];
      const isValid = await AuthUtils.comparePassword(currentPassword, user.password);
      if (!isValid) {
        res.status(401).json({ message: 'Current password is incorrect' });
        return;
      }
    }

    const passwordHash = await AuthUtils.hashPassword(newPassword);
    const result = await UsersDao.updatePassword(id, passwordHash);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('[users.controller][changePassword][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateDarkMode = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { darkMode } = req.body;

    // Only allow users to update their own dark mode preference
    if (req.user?.id !== id) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }

    if (typeof darkMode !== 'boolean') {
      res.status(400).json({ message: 'darkMode must be a boolean value' });
      return;
    }

    const result = await UsersDao.updateDarkMode(id, darkMode);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'Dark mode preference updated successfully', darkMode });
  } catch (error) {
    console.error('[users.controller][updateDarkMode][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deactivate = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id);

    // Prevent self-deletion
    if (req.user?.id === id) {
      res.status(400).json({ message: 'Cannot delete your own account' });
      return;
    }

    // Delete all refresh tokens for this user first (due to foreign key)
    await UsersDao.deleteUserRefreshTokens(id);

    // Delete the user from the database
    const result = await UsersDao.deleteUser(id);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('[users.controller][deactivate][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
