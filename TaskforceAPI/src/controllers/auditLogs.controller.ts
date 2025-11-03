import { Response } from 'express';
import * as AuditLogsDao from '../dao/auditLogs.dao';
import { AuthRequest } from '../middleware/auth.middleware';

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
