/**
 * Archive Schedule model type definitions.
 * Defines automated archive scheduling, archived assignment storage, execution logs, and API request/response structures.
 */
export interface ArchiveSchedule {
  id?: number;
  schedule_time: string; // HH:MM:SS format
  shift: string; // '1st', '2nd', or '3rd'
  enabled: boolean;
  created_at?: Date;
  updated_at?: Date;
  created_by?: number;
}

export interface ArchivedAssignment {
  id?: number;
  original_assignment_id: number;
  task_id: number;
  personnel_id: number;
  personnel_name: string;
  role?: string;
  task_description: string;
  task_status: string;
  task_date: Date;
  task_shift: string;
  aircraft_tail: string;
  archived_at?: Date;
  archived_by_schedule: boolean;
}

export interface ArchiveLog {
  id?: number;
  archive_type: 'MANUAL' | 'SCHEDULED';
  shift: string; // '1st', '2nd', or '3rd'
  assignments_archived: number;
  archive_date: Date;
  triggered_by?: number;
  schedule_id?: number;
  created_at?: Date;
}

export interface ArchiveRequest {
  shift: string; // Required: which shift to archive
}

export interface ArchiveResponse {
  success: boolean;
  message: string;
  assignments_archived: number;
  log_id: number;
}
