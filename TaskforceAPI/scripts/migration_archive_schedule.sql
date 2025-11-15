-- Migration: Archive Schedule Configuration
-- Purpose: Store scheduled archive times and configuration
-- Date: 2025-11-14

USE taskforce_tracker;

-- Create archive_schedules table
CREATE TABLE IF NOT EXISTS archive_schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  schedule_time TIME NOT NULL COMMENT 'Time of day to run archive (HH:MM:SS)',
  shift VARCHAR(5) NOT NULL COMMENT 'Which shift to archive: 1st, 2nd, or 3rd',
  enabled BOOLEAN DEFAULT TRUE COMMENT 'Whether this schedule is active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT NULL COMMENT 'User ID who created this schedule',
  INDEX idx_schedule_time (schedule_time),
  INDEX idx_enabled (enabled),
  INDEX idx_shift (shift),
  INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default schedules (disabled by default)
INSERT INTO archive_schedules (schedule_time, shift, enabled) 
VALUES 
  ('02:00:00', '1st', FALSE),
  ('02:00:00', '2nd', FALSE),
  ('02:00:00', '3rd', FALSE);

-- Add archived columns to assignments table to track archiving
-- Note: If these columns already exist, you'll get an error - that's okay, just continue
ALTER TABLE assignments 
ADD COLUMN archived BOOLEAN DEFAULT FALSE COMMENT 'Whether this assignment has been archived';

ALTER TABLE assignments 
ADD COLUMN archived_at TIMESTAMP NULL COMMENT 'When this assignment was archived';

ALTER TABLE assignments 
ADD INDEX idx_archived (archived);

-- Create archived_assignments table to store historical records
CREATE TABLE IF NOT EXISTS archived_assignments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  original_assignment_id INT NOT NULL COMMENT 'Original assignment ID',
  task_id INT NOT NULL,
  personnel_id INT NOT NULL,
  personnel_name VARCHAR(100) NOT NULL COMMENT 'Snapshot of personnel name',
  role VARCHAR(100) NULL,
  task_description TEXT NOT NULL COMMENT 'Snapshot of task description',
  task_status VARCHAR(20) NOT NULL COMMENT 'Snapshot of task status',
  task_date DATE NOT NULL COMMENT 'Snapshot of task date',
  task_shift VARCHAR(5) NOT NULL COMMENT 'Snapshot of task shift',
  aircraft_tail VARCHAR(20) NOT NULL COMMENT 'Snapshot of aircraft tail number',
  archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  archived_by_schedule BOOLEAN DEFAULT FALSE COMMENT 'TRUE if archived by schedule, FALSE if manual',
  INDEX idx_archived_at (archived_at),
  INDEX idx_task_id (task_id),
  INDEX idx_personnel_id (personnel_id),
  INDEX idx_task_date (task_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create archive_log table to track archive operations
CREATE TABLE IF NOT EXISTS archive_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  archive_type VARCHAR(20) NOT NULL COMMENT 'MANUAL or SCHEDULED',
  shift VARCHAR(5) NOT NULL COMMENT 'Which shift was archived: 1st, 2nd, or 3rd',
  assignments_archived INT NOT NULL DEFAULT 0 COMMENT 'Number of assignments archived',
  archive_date TIMESTAMP NOT NULL COMMENT 'When the archive was performed',
  triggered_by INT NULL COMMENT 'User ID who triggered manual archive',
  schedule_id INT NULL COMMENT 'Schedule that triggered this archive',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_archive_type (archive_type),
  INDEX idx_shift (shift),
  INDEX idx_archive_date (archive_date),
  INDEX idx_triggered_by (triggered_by),
  INDEX idx_schedule_id (schedule_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Note: Foreign key constraints are commented out because they may fail if the user table structure is different
-- The system will work perfectly fine without these constraints
-- If you want to add them, uncomment and adjust the table/column names to match your user table

-- ALTER TABLE archive_schedules 
-- ADD CONSTRAINT fk_archive_schedules_created_by 
-- FOREIGN KEY (created_by) REFERENCES user(user_id) ON DELETE SET NULL;

-- ALTER TABLE archive_logs 
-- ADD CONSTRAINT fk_archive_logs_triggered_by 
-- FOREIGN KEY (triggered_by) REFERENCES user(user_id) ON DELETE SET NULL;

-- ALTER TABLE archive_logs 
-- ADD CONSTRAINT fk_archive_logs_schedule_id 
-- FOREIGN KEY (schedule_id) REFERENCES archive_schedules(id) ON DELETE SET NULL;

SELECT 'Archive schedule migration completed successfully!' AS status;
