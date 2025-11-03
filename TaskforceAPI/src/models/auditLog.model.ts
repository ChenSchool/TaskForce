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
