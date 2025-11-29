/**
 * Audit Logs Controller
 * 
 * Handles HTTP requests for retrieving audit log records with filtering
 * by user, entity type, and pagination support. Restricted to authorized users.
 */

import { Response } from 'express';
import * as AuditLogsDao from '../dao/auditLogs.dao';
import { AuthRequest } from '../middleware/auth.middleware';

/**
 * Get all audit logs with pagination
 * @route GET /api/audit-logs
 */
export const getAll = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    const logs = await AuditLogsDao.getAllAuditLogs(limit, offset);
    res.json(logs);
  } catch (error) {
    console.error('[auditLogs.controller][getAll][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get audit logs for a specific user
 * @route GET /api/audit-logs/user/:userId
 */
export const getByUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = parseInt(req.params.userId);
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;

    const logs = await AuditLogsDao.getAuditLogsByUser(userId, limit, offset);
    res.json(logs);
  } catch (error) {
    console.error('[auditLogs.controller][getByUser][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * Get audit logs for a specific entity
 * @route GET /api/audit-logs/entity/:entityType/:entityId
 */
export const getByEntity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { entityType, entityId } = req.params;

    const logs = await AuditLogsDao.getAuditLogsByEntity(entityType, parseInt(entityId));
    res.json(logs);
  } catch (error) {
    console.error('[auditLogs.controller][getByEntity][Error]', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
