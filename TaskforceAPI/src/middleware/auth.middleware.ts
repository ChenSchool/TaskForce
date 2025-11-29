/**
 * Authentication and Authorization Middleware
 * Validates JWT tokens and enforces role-based access control
 */
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/auth.utils';

// Extend Express Request with authenticated user data
export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

/**
 * Authenticate middleware
 * Verifies JWT token from Authorization header and attaches user to request
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const token = authHeader.substring(7);
  const decoded = verifyAccessToken(token);

  if (!decoded) {
    res.status(401).json({ message: 'Invalid or expired token' });
    return;
  }

  req.user = decoded;
  next();
};

/**
 * Authorize middleware factory
 * Creates middleware that checks if user has required role(s)
 * @param roles - Allowed roles for the route
 */
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }

    next();
  };
};
