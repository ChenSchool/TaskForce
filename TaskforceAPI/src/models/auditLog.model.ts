/**
 * Audit Log Model
 * 
 * TypeScript interface for audit log records that track user actions,
 * entity changes, and system activity for compliance and debugging.
 */

/**
 * AuditLog interface representing a system audit trail entry
 */
export interface AuditLog {
  id: number;
  user_id: number | null;
  action: string;
  entity_type: string;
  entity_id: number | null;
  changes: any;
  ip_address: string | null;
  created_at: Date;
  username?: string;
}

export interface CreateAuditLogRequest {
  user_id: number | null;
  action: string;
  entity_type: string;
  entity_id: number | null;
  changes?: any;
  ip_address?: string;
}
