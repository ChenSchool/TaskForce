/**
 * Audit Logs SQL Queries
 * 
 * Contains parameterized SQL queries for audit log operations including
 * creating entries and retrieving logs with user/entity filtering.
 */

export const auditLogsQueries = {
  createAuditLog: `
    INSERT INTO audit_logs (user_id, action, entity_type, entity_id, changes, ip_address)
    VALUES (?, ?, ?, ?, ?, ?)
  `,
  
  getAllAuditLogs: `
    SELECT al.*, u.username
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    ORDER BY al.created_at DESC
    LIMIT ? OFFSET ?
  `,
  
  getAuditLogsByUser: `
    SELECT al.*, u.username
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE al.user_id = ?
    ORDER BY al.created_at DESC
    LIMIT ? OFFSET ?
  `,
  
  getAuditLogsByEntity: `
    SELECT al.*, u.username
    FROM audit_logs al
    LEFT JOIN users u ON al.user_id = u.id
    WHERE al.entity_type = ? AND al.entity_id = ?
    ORDER BY al.created_at DESC
  `
};
