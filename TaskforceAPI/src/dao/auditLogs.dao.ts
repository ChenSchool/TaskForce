import { OkPacket } from 'mysql';
import { execute } from '../services/mysql.connector';
import { AuditLog, CreateAuditLogRequest } from '../models/auditLog.model';
import { auditLogsQueries } from '../queries/auditLogs.queries';

export const createAuditLog = async (data: CreateAuditLogRequest) => {
  return execute<OkPacket>(auditLogsQueries.createAuditLog, [
    data.user_id,
    data.action,
    data.entity_type,
    data.entity_id,
    data.changes ? JSON.stringify(data.changes) : null,
    data.ip_address
  ]);
};

export const getAllAuditLogs = async (limit: number = 100, offset: number = 0) => {
  return execute<AuditLog[]>(auditLogsQueries.getAllAuditLogs, [limit, offset]);
};

export const getAuditLogsByUser = async (userId: number, limit: number = 100, offset: number = 0) => {
  return execute<AuditLog[]>(auditLogsQueries.getAuditLogsByUser, [userId, limit, offset]);
};

export const getAuditLogsByEntity = async (entityType: string, entityId: number) => {
  return execute<AuditLog[]>(auditLogsQueries.getAuditLogsByEntity, [entityType, entityId]);
};
