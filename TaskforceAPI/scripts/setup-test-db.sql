-- Create test database
CREATE DATABASE IF NOT EXISTS taskforce_test;

USE taskforce_test;

-- Drop existing tables if they exist (for clean setup)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS archived_assignments;
DROP TABLE IF EXISTS archive_logs;
DROP TABLE IF EXISTS archive_schedules;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS training;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS personnel;
DROP TABLE IF EXISTS aircraft;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100),
    role ENUM('Production Lead', 'Supervisor', 'Manager', 'Task Viewer') DEFAULT 'Task Viewer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    dark_mode BOOLEAN DEFAULT FALSE,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Refresh tokens table
CREATE TABLE refresh_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token(255)),
    INDEX idx_user_id (user_id)
);

-- Aircraft table
CREATE TABLE aircraft (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tail_number VARCHAR(20) UNIQUE NOT NULL,
    INDEX idx_tail_number (tail_number)
);

-- Personnel table
CREATE TABLE personnel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialty ENUM('A&P', 'Avionics', 'Integration', 'AMT') NOT NULL,
    role ENUM('Captain', 'Coordinator', 'Collaborator', 'Trainee') NOT NULL,
    shift ENUM('1st', '2nd', '3rd') NOT NULL,
    INDEX idx_shift (shift),
    INDEX idx_name (name)
);

-- Tasks table
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    aircraft_id INT NOT NULL,
    shift ENUM('1st', '2nd', '3rd') NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'Incomplete',
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (aircraft_id) REFERENCES aircraft(id) ON DELETE CASCADE,
    INDEX idx_aircraft_id (aircraft_id),
    INDEX idx_shift (shift),
    INDEX idx_date (date)
);

-- Assignments table
CREATE TABLE assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT NOT NULL,
    personnel_id INT NOT NULL,
    role VARCHAR(50),
    archived BOOLEAN DEFAULT FALSE,
    archived_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE,
    INDEX idx_task_id (task_id),
    INDEX idx_personnel_id (personnel_id),
    INDEX idx_archived (archived)
);

-- Training table
CREATE TABLE training (
    id INT AUTO_INCREMENT PRIMARY KEY,
    personnel_id INT NOT NULL,
    phase VARCHAR(100) NOT NULL,
    progress INT DEFAULT 0,
    complete BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (personnel_id) REFERENCES personnel(id) ON DELETE CASCADE,
    INDEX idx_personnel_id (personnel_id)
);

-- Archive schedules table
CREATE TABLE archive_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    schedule_time TIME NOT NULL,
    shift ENUM('1st', '2nd', '3rd') NOT NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_shift (shift),
    INDEX idx_enabled (enabled)
);

-- Archived assignments table
CREATE TABLE archived_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    original_assignment_id INT NOT NULL,
    task_id INT,
    personnel_id INT,
    personnel_name VARCHAR(100),
    role VARCHAR(50),
    task_description TEXT,
    task_status VARCHAR(50),
    task_date DATE,
    task_shift ENUM('1st', '2nd', '3rd'),
    aircraft_tail VARCHAR(20),
    archived_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    archived_by_schedule BOOLEAN DEFAULT FALSE,
    INDEX idx_archived_at (archived_at),
    INDEX idx_task_shift (task_shift),
    INDEX idx_task_date (task_date)
);

-- Archive logs table
CREATE TABLE archive_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    archive_type ENUM('MANUAL', 'SCHEDULED') NOT NULL,
    shift ENUM('1st', '2nd', '3rd') NOT NULL,
    assignments_archived INT DEFAULT 0,
    archive_date TIMESTAMP NOT NULL,
    triggered_by INT,
    schedule_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (triggered_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (schedule_id) REFERENCES archive_schedules(id) ON DELETE SET NULL,
    INDEX idx_archive_date (archive_date),
    INDEX idx_shift (shift)
);

-- Audit logs table
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,
    details JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
);

SELECT 'Test database schema created successfully!' AS Status;
