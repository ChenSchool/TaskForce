-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 29, 2025 at 06:38 PM
-- Server version: 5.7.24
-- PHP Version: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `taskforce_test`
--

-- --------------------------------------------------------

--
-- Table structure for table `aircraft`
--

CREATE TABLE `aircraft` (
  `id` int(11) NOT NULL,
  `tail_number` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `aircraft`
--

INSERT INTO `aircraft` (`id`, `tail_number`) VALUES
(1, 'SEED-001'),
(2, 'SEED-002'),
(3, 'SEED-003'),
(12, 'TEST-002'),
(16, 'TEST-DELETE'),
(13, 'TEST-UPDATE-SUPER');

-- --------------------------------------------------------

--
-- Table structure for table `archived_assignments`
--

CREATE TABLE `archived_assignments` (
  `id` int(11) NOT NULL,
  `original_assignment_id` int(11) NOT NULL,
  `task_id` int(11) DEFAULT NULL,
  `personnel_id` int(11) DEFAULT NULL,
  `personnel_name` varchar(100) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `task_description` text,
  `task_status` varchar(50) DEFAULT NULL,
  `task_date` date DEFAULT NULL,
  `task_shift` enum('1st','2nd','3rd') DEFAULT NULL,
  `aircraft_tail` varchar(20) DEFAULT NULL,
  `archived_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `archived_by_schedule` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `archived_assignments`
--

INSERT INTO `archived_assignments` (`id`, `original_assignment_id`, `task_id`, `personnel_id`, `personnel_name`, `role`, `task_description`, `task_status`, `task_date`, `task_shift`, `aircraft_tail`, `archived_at`, `archived_by_schedule`) VALUES
(1, 1, 1, 1, 'John Doe', 'Captain', 'Test task for 1st shift', 'Complete', '2025-11-23', '1st', 'SEED-001', '2025-11-24 05:39:54', 0);

-- --------------------------------------------------------

--
-- Table structure for table `archive_logs`
--

CREATE TABLE `archive_logs` (
  `id` int(11) NOT NULL,
  `archive_type` enum('MANUAL','SCHEDULED') NOT NULL,
  `shift` enum('1st','2nd','3rd') NOT NULL,
  `assignments_archived` int(11) DEFAULT '0',
  `archive_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `triggered_by` int(11) DEFAULT NULL,
  `schedule_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `archive_logs`
--

INSERT INTO `archive_logs` (`id`, `archive_type`, `shift`, `assignments_archived`, `archive_date`, `triggered_by`, `schedule_id`, `created_at`) VALUES
(1, 'MANUAL', '1st', 1, '2025-11-24 05:39:54', 1, NULL, '2025-11-24 05:39:54');

-- --------------------------------------------------------

--
-- Table structure for table `archive_schedules`
--

CREATE TABLE `archive_schedules` (
  `id` int(11) NOT NULL,
  `schedule_time` time NOT NULL,
  `shift` enum('1st','2nd','3rd') NOT NULL,
  `enabled` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `personnel_id` int(11) NOT NULL,
  `role` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `archived` tinyint(1) DEFAULT '0',
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`id`, `task_id`, `personnel_id`, `role`, `created_at`, `archived`, `archived_at`) VALUES
(1, 1, 1, 'Captain', '2025-11-24 05:39:51', 1, '2025-11-24 05:39:54'),
(2, 2, 2, 'Coordinator', '2025-11-24 05:39:51', 0, NULL),
(3, 3, 4, 'Trainee', '2025-11-24 05:39:51', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `entity_type` varchar(50) NOT NULL,
  `entity_id` int(11) DEFAULT NULL,
  `details` json DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `personnel`
--

CREATE TABLE `personnel` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `specialty` enum('A&P','Avionics','Integration','AMT') NOT NULL,
  `role` enum('Captain','Coordinator','Collaborator','Trainee') NOT NULL,
  `shift` enum('1st','2nd','3rd') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `personnel`
--

INSERT INTO `personnel` (`id`, `name`, `specialty`, `role`, `shift`) VALUES
(1, 'John Doe', 'A&P', 'Captain', '1st'),
(2, 'Jane Smith', 'Avionics', 'Coordinator', '2nd'),
(3, 'Bob Johnson', 'Integration', 'Collaborator', '1st'),
(4, 'Alice Williams', 'AMT', 'Trainee', '3rd'),
(6, 'Test Person Supervisor', 'A&P', 'Coordinator', '2nd'),
(7, 'Test Person 1st', 'Avionics', 'Coordinator', '1st'),
(8, 'Test Person 2nd', 'Avionics', 'Coordinator', '2nd'),
(9, 'Test Person 3rd', 'Avionics', 'Coordinator', '3rd'),
(10, 'Test Person Captain', 'Avionics', 'Captain', '1st'),
(11, 'Test Person Coordinator', 'Avionics', 'Coordinator', '1st'),
(12, 'Test Person Collaborator', 'Avionics', 'Collaborator', '1st'),
(13, 'Test Person Trainee', 'Avionics', 'Trainee', '1st'),
(14, 'Test Person Supervisor Update', 'Integration', 'Trainee', '3rd'),
(17, 'Test Person Delete', 'Avionics', 'Captain', '1st'),
(18, 'Test Person Delete', 'Avionics', 'Captain', '1st'),
(19, 'Test Person Delete', 'Avionics', 'Captain', '1st');

-- --------------------------------------------------------

--
-- Table structure for table `refresh_tokens`
--

CREATE TABLE `refresh_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(500) NOT NULL,
  `expires_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `refresh_tokens`
--

INSERT INTO `refresh_tokens` (`id`, `user_id`, `token`, `expires_at`, `created_at`) VALUES
(1, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0YWRtaW4iLCJpYXQiOjE3NjM5NjI3OTMsImV4cCI6MTc2NDU2NzU5M30.z8_2ZC6NjbqEF429J-zngb1Fj7B3DMEMG9D9fZh7tKo', '2025-12-01 05:39:53', '2025-11-24 05:39:53'),
(2, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0ZXN0c3VwZXJ2aXNvciIsImlhdCI6MTc2Mzk2Mjc5MywiZXhwIjoxNzY0NTY3NTkzfQ.qswCohT-g4N29mC8d_ecNKeXZor_lVFr5wnEVicVI2o', '2025-12-01 05:39:53', '2025-11-24 05:39:53'),
(3, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0YWRtaW4iLCJpYXQiOjE3NjM5NjI3OTQsImV4cCI6MTc2NDU2NzU5NH0.j5fCZuIhuVgGJlbDJFYB7N5HiZcOK-Wf_auFFM8w4r8', '2025-12-01 05:39:55', '2025-11-24 05:39:54'),
(4, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0ZXN0c3VwZXJ2aXNvciIsImlhdCI6MTc2Mzk2Mjc5NCwiZXhwIjoxNzY0NTY3NTk0fQ.eQ6E-knHn9IgvBcmvnBqlCsMRmZRuPEGJIBVhNhXyuw', '2025-12-01 05:39:55', '2025-11-24 05:39:54'),
(5, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0YWRtaW4iLCJpYXQiOjE3NjM5NjI3OTYsImV4cCI6MTc2NDU2NzU5Nn0.Ym8fWQbM_sIMF68Z33fqKYRRVLnPJsD_hI0fPcLaVvY', '2025-12-01 05:39:56', '2025-11-24 05:39:56'),
(6, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0ZXN0c3VwZXJ2aXNvciIsImlhdCI6MTc2Mzk2Mjc5NiwiZXhwIjoxNzY0NTY3NTk2fQ.bAaI6e6w4IcB1Oo3qu0KZc8dtYTX90KlmK7OorD0C3s', '2025-12-01 05:39:56', '2025-11-24 05:39:56'),
(7, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0YWRtaW4iLCJpYXQiOjE3NjM5NjI3OTcsImV4cCI6MTc2NDU2NzU5N30.Gh6NFjRJX1lkKScfxDP3rD4XJzyW1phVMD9vqkj3RMg', '2025-12-01 05:39:57', '2025-11-24 05:39:57'),
(8, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0ZXN0c3VwZXJ2aXNvciIsImlhdCI6MTc2Mzk2Mjc5NywiZXhwIjoxNzY0NTY3NTk3fQ.Fz8rWTI00_tPSmBpy1R8yqf7C520K-bOGDFWarsOjUU', '2025-12-01 05:39:57', '2025-11-24 05:39:57'),
(9, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0YWRtaW4iLCJpYXQiOjE3NjM5NjI3OTgsImV4cCI6MTc2NDU2NzU5OH0.sJkby7UQIk7UpFq6NAtgQTgnuZiv5OlJr5QotbDaeNw', '2025-12-01 05:39:58', '2025-11-24 05:39:58'),
(10, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0ZXN0c3VwZXJ2aXNvciIsImlhdCI6MTc2Mzk2Mjc5OCwiZXhwIjoxNzY0NTY3NTk4fQ.xw1lkaX8GeLtwbk8t-OjzWMugroS_U_K_4WH9moqeMk', '2025-12-01 05:39:58', '2025-11-24 05:39:58'),
(11, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0YWRtaW4iLCJpYXQiOjE3NjM5NjI3OTksImV4cCI6MTc2NDU2NzU5OX0.jp-ygHqwrzNYLMSI7Pu36GtjSTM5pPSw9rF2wKjdxHk', '2025-12-01 05:39:59', '2025-11-24 05:39:59'),
(12, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0ZXN0c3VwZXJ2aXNvciIsImlhdCI6MTc2Mzk2Mjc5OSwiZXhwIjoxNzY0NTY3NTk5fQ.a6uuIlB3H_4P4xFnKU27Y_IWoz-o3gjiuQvaHSDTzHs', '2025-12-01 05:39:59', '2025-11-24 05:39:59'),
(13, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0YWRtaW4iLCJpYXQiOjE3NjM5NjI4MDAsImV4cCI6MTc2NDU2NzYwMH0.7DEOwTfdDKjAEogOYP6luxZqrcx0qtGkSCz3OWiOQ0k', '2025-12-01 05:40:00', '2025-11-24 05:40:00'),
(14, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0ZXN0c3VwZXJ2aXNvciIsImlhdCI6MTc2Mzk2MjgwMCwiZXhwIjoxNzY0NTY3NjAwfQ.9OhOZM8qVr9B77mIOj-6neAwRq2TYU9rhPVXKhpHzMQ', '2025-12-01 05:40:00', '2025-11-24 05:40:00'),
(15, 1, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0YWRtaW4iLCJpYXQiOjE3NjM5NjI4MDAsImV4cCI6MTc2NDU2NzYwMH0.7DEOwTfdDKjAEogOYP6luxZqrcx0qtGkSCz3OWiOQ0k', '2025-12-01 05:40:01', '2025-11-24 05:40:00'),
(16, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwidXNlcm5hbWUiOiJ0ZXN0c3VwZXJ2aXNvciIsImlhdCI6MTc2Mzk2MjgwMSwiZXhwIjoxNzY0NTY3NjAxfQ.zoH5uJ1ufUx2NRokFLoTVWwBZdYVPwCSqEwf3mcsARg', '2025-12-01 05:40:01', '2025-11-24 05:40:01'),
(17, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTc2Mzk2MjgwMSwiZXhwIjoxNzY0NTY3NjAxfQ.tlYdxL3coR09AGmKEPMfWsnkPCgpkY4dQqsuH6dzv6g', '2025-12-01 05:40:02', '2025-11-24 05:40:01'),
(18, 4, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJhZG1pbiIsImlhdCI6MTc2Mzk2MjgwMSwiZXhwIjoxNzY0NTY3NjAxfQ.tlYdxL3coR09AGmKEPMfWsnkPCgpkY4dQqsuH6dzv6g', '2025-12-01 05:40:02', '2025-11-24 05:40:01');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `aircraft_id` int(11) NOT NULL,
  `shift` enum('1st','2nd','3rd') NOT NULL,
  `description` text NOT NULL,
  `status` varchar(50) DEFAULT 'Incomplete',
  `date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `aircraft_id`, `shift`, `description`, `status`, `date`, `created_at`, `updated_at`) VALUES
(1, 1, '1st', 'Test task for 1st shift', 'Complete', '2025-11-23', '2025-11-24 05:39:51', '2025-11-24 05:39:51'),
(2, 2, '2nd', 'Test task for 2nd shift', 'Complete', '2025-11-23', '2025-11-24 05:39:51', '2025-11-24 05:39:51'),
(3, 3, '3rd', 'Test task for 3rd shift', 'In Progress', '2025-11-23', '2025-11-24 05:39:51', '2025-11-24 05:39:51');

-- --------------------------------------------------------

--
-- Table structure for table `training`
--

CREATE TABLE `training` (
  `id` int(11) NOT NULL,
  `personnel_id` int(11) NOT NULL,
  `phase` varchar(100) NOT NULL,
  `progress` int(11) DEFAULT '0',
  `complete` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `role` enum('Production Lead','Supervisor','Manager','Task Viewer') DEFAULT 'Task Viewer',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `last_login` timestamp NULL DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `dark_mode` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `name`, `role`, `created_at`, `updated_at`, `last_login`, `is_active`, `dark_mode`) VALUES
(1, 'testadmin', 'admin@test.com', '$2b$10$7vwupEzud.J6oCqQyhCwaeHXQeqPLaaAyEvEK5VdYMBbLo6L7Wade', 'Test Admin', 'Manager', '2025-11-24 05:39:51', '2025-11-24 05:40:00', '2025-11-24 05:40:00', 1, 0),
(2, 'testsupervisor', 'supervisor@test.com', '$2b$10$7vwupEzud.J6oCqQyhCwaeHXQeqPLaaAyEvEK5VdYMBbLo6L7Wade', 'Test Supervisor', 'Supervisor', '2025-11-24 05:39:51', '2025-11-24 05:40:01', '2025-11-24 05:40:01', 1, 0),
(3, 'testuser', 'user@test.com', '$2b$10$7vwupEzud.J6oCqQyhCwaeHXQeqPLaaAyEvEK5VdYMBbLo6L7Wade', 'Test User', 'Task Viewer', '2025-11-24 05:39:51', '2025-11-24 05:39:51', NULL, 1, 0),
(4, 'admin', 'admin@taskforce.com', '$2b$10$y5FlsjWa92EIFPTdf6YKmuVAe8R9ZCfJicsIxjlhNyrbDAWVBWbEW', 'Admin User', 'Manager', '2025-11-24 05:39:51', '2025-11-24 05:40:01', '2025-11-24 05:40:01', 1, 0),
(6, 'testuser_super', 'testsupervisor@test.com', '$2b$10$od8Irnwm146RUqT5fhrp.e1KB7wpCZjQr0.cZqBH21hFSYMrjTDqO', NULL, 'Task Viewer', '2025-11-24 05:39:54', '2025-11-24 05:39:54', NULL, 1, 0),
(7, 'testuser_update', 'updated@test.com', '$2b$10$Jvz0FnDAX9lndFIo87TcHeKXu7b7RJkaC9jIFkZzqw3M./WlwUxjS', NULL, 'Supervisor', '2025-11-24 05:39:55', '2025-11-24 05:39:55', NULL, 1, 0),
(10, 'testuser_del_1763962795350', 'testdelete1763962795350@test.com', '$2b$10$5iQC0kkoC4rCQsb1sX/6uOHAqU4AZ8OtBmUjUUw5DjJqJSuj5JuWy', NULL, 'Task Viewer', '2025-11-24 05:39:55', '2025-11-24 05:39:55', NULL, 1, 0),
(11, 'testuser_del_1763962795436', 'testdelete1763962795436@test.com', '$2b$10$O7SwKd3XPWP5RgLFbFaipuKdOEuYdPPjsgeUWtN.0Y6g42x79F5/e', NULL, 'Task Viewer', '2025-11-24 05:39:55', '2025-11-24 05:39:55', NULL, 1, 0),
(12, 'roletest', 'roletest@test.com', '$2b$10$CoobO91egFQ159aSexQQKurbgb9JTyE4fgPmOgN7udPnOx.ZrwUmC', NULL, 'Task Viewer', '2025-11-24 05:39:55', '2025-11-24 05:39:55', NULL, 1, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aircraft`
--
ALTER TABLE `aircraft`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tail_number` (`tail_number`),
  ADD KEY `idx_tail_number` (`tail_number`);

--
-- Indexes for table `archived_assignments`
--
ALTER TABLE `archived_assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_archived_at` (`archived_at`),
  ADD KEY `idx_task_shift` (`task_shift`),
  ADD KEY `idx_task_date` (`task_date`);

--
-- Indexes for table `archive_logs`
--
ALTER TABLE `archive_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `triggered_by` (`triggered_by`),
  ADD KEY `schedule_id` (`schedule_id`),
  ADD KEY `idx_archive_date` (`archive_date`),
  ADD KEY `idx_shift` (`shift`);

--
-- Indexes for table `archive_schedules`
--
ALTER TABLE `archive_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_archive_schedules_created_by` (`created_by`);

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_task_id` (`task_id`),
  ADD KEY `idx_personnel_id` (`personnel_id`),
  ADD KEY `idx_archived` (`archived`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_action` (`action`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `personnel`
--
ALTER TABLE `personnel`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_shift` (`shift`),
  ADD KEY `idx_name` (`name`);

--
-- Indexes for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_token` (`token`(255)),
  ADD KEY `idx_user_id` (`user_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_aircraft_id` (`aircraft_id`),
  ADD KEY `idx_shift` (`shift`),
  ADD KEY `idx_date` (`date`);

--
-- Indexes for table `training`
--
ALTER TABLE `training`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_personnel_id` (`personnel_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_username` (`username`),
  ADD KEY `idx_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aircraft`
--
ALTER TABLE `aircraft`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `archived_assignments`
--
ALTER TABLE `archived_assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `archive_logs`
--
ALTER TABLE `archive_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `archive_schedules`
--
ALTER TABLE `archive_schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personnel`
--
ALTER TABLE `personnel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `training`
--
ALTER TABLE `training`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `archive_logs`
--
ALTER TABLE `archive_logs`
  ADD CONSTRAINT `archive_logs_ibfk_1` FOREIGN KEY (`triggered_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `archive_logs_ibfk_2` FOREIGN KEY (`schedule_id`) REFERENCES `archive_schedules` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `archive_schedules`
--
ALTER TABLE `archive_schedules`
  ADD CONSTRAINT `fk_archive_schedules_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assignments_ibfk_2` FOREIGN KEY (`personnel_id`) REFERENCES `personnel` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `refresh_tokens`
--
ALTER TABLE `refresh_tokens`
  ADD CONSTRAINT `refresh_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`aircraft_id`) REFERENCES `aircraft` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `training`
--
ALTER TABLE `training`
  ADD CONSTRAINT `training_ibfk_1` FOREIGN KEY (`personnel_id`) REFERENCES `personnel` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
