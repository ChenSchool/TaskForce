/**
 * Audit Logs Data Access Object
 * 
 * Provides database operations for audit log records including creating logs
 * and retrieving with various filters (user, entity, pagination).
 */

import { OkPacket } from 'mysql';
import { execute } from '../services/mysql.connector';
import { AuditLog, CreateAuditLogRequest } from '../models/auditLog.model';
import { auditLogsQueries } from '../queries/auditLogs.queries';

/**
 * Create a new audit log entry
 */
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

/**
 * Get all audit logs with pagination
 */
export const getAllAuditLogs = async (limit: number = 100, offset: number = 0) => {
  return execute<AuditLog[]>(auditLogsQueries.getAllAuditLogs, [limit, offset]);
};

/**
 * Get audit logs filtered by user ID
 */
export const getAuditLogsByUser = async (userId: number, limit: number = 100, offset: number = 0) => {
  return execute<AuditLog[]>(auditLogsQueries.getAuditLogsByUser, [userId, limit, offset]);
};

/**
 * Get audit logs filtered by entity type and ID
 */
export const getAuditLogsByEntity = async (entityType: string, entityId: number) => {
  return execute<AuditLog[]>(auditLogsQueries.getAuditLogsByEntity, [entityType, entityId]);
};
