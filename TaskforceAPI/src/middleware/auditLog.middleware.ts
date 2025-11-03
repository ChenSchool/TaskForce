import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import * as AuditLogsDao from '../dao/auditLogs.dao';

export const auditLog = (action: string, entityType: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const originalSend = res.json.bind(res);
    
    res.json = function (body: any) {
      // Only log successful operations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const entityId = req.params.id ? parseInt(req.params.id) : body?.id || null;
        
        AuditLogsDao.createAuditLog({
          user_id: req.user?.id || null,
          action,
          entity_type: entityType,
          entity_id: entityId,
          changes: req.body,
          ip_address: req.ip
        }).catch(err => console.error('Audit log error:', err));
      }
      
      return originalSend(body);
    };
    
    next();
  };
};
