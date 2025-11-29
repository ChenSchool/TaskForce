-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 03, 2025 at 12:42 AM
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
-- Database: `taskforce_tracker`
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
(5, 'N111JK'),
(4, 'N1123L'),
(7, 'N37649KI'),
(1, 'N54321'),
(6, 'N987654');

-- --------------------------------------------------------

--
-- Table structure for table `archive`
--

CREATE TABLE `archive` (
  `id` int(11) NOT NULL,
  `snapshot_date` date NOT NULL,
  `snapshot_time` time NOT NULL,
  `shift` enum('1st','2nd','3rd') DEFAULT NULL,
  `aircraft_tail` varchar(20) NOT NULL,
  `data_json` json DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL,
  `task_id` int(11) DEFAULT NULL,
  `personnel_id` int(11) DEFAULT NULL,
  `role` enum('Captain','Coordinator','Collaborator','Trainee') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`id`, `task_id`, `personnel_id`, `role`) VALUES
(1, 2, 2, 'Captain'),
(3, 2, NULL, NULL),
(5, 4, NULL, NULL),
(6, 4, NULL, NULL),
(7, 5, NULL, NULL),
(18, 1, 2, 'Captain'),
(19, 1, 6, 'Coordinator'),
(20, 1, 8, 'Collaborator'),
(21, 1, 10, 'Trainee'),
(22, 3, 11, 'Coordinator');

-- --------------------------------------------------------

--
-- Table structure for table `personnel`
--

CREATE TABLE `personnel` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `specialty` enum('A&P','Avionics','Integration','AMT') DEFAULT NULL,
  `role` enum('Captain','Coordinator','Collaborator','Trainee') DEFAULT NULL,
  `shift` enum('1st','2nd','3rd') DEFAULT '1st'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `personnel`
--

INSERT INTO `personnel` (`id`, `name`, `specialty`, `role`, `shift`) VALUES
(2, 'John Smith', 'Integration', 'Captain', '1st'),
(6, 'Jane Doe', 'Avionics', 'Coordinator', '1st'),
(8, 'That one guy', 'Avionics', 'Trainee', '1st'),
(9, 'Christian Contreras', 'Avionics', 'Trainee', '2nd'),
(10, 'New Guy', 'AMT', 'Trainee', '2nd'),
(11, 'Poopoopeepeeman', 'A&P', 'Coordinator', '3rd');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `aircraft_id` int(11) DEFAULT NULL,
  `shift` enum('1st','2nd','3rd') DEFAULT NULL,
  `description` text,
  `status` enum('Incomplete','Complete') DEFAULT 'Incomplete',
  `date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `aircraft_id`, `shift`, `description`, `status`, `date`) VALUES
(1, 1, '1st', 'Inspect landing gear', 'Incomplete', '2025-04-25'),
(2, 1, '1st', 'Replace Fuselage', 'Incomplete', '2025-04-25'),
(3, 7, '3rd', 'Reinstall Gremlins', 'Complete', '2025-05-16'),
(4, 1, '2nd', 'Add a new pilot to the plane', 'Incomplete', '2025-05-04'),
(5, 1, '2nd', 'Eat a sandwich on top of the plane', 'Incomplete', '2025-10-25');

-- --------------------------------------------------------

--
-- Table structure for table `training`
--

CREATE TABLE `training` (
  `id` int(11) NOT NULL,
  `personnel_id` int(11) DEFAULT NULL,
  `phase` varchar(50) DEFAULT NULL,
  `progress` int(11) DEFAULT NULL,
  `complete` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `training`
--

INSERT INTO `training` (`id`, `personnel_id`, `phase`, `progress`, `complete`) VALUES
(1, 9, 'Phase 100', 95, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('Production Lead','Supervisor','Manager','Task Viewer') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aircraft`
--
ALTER TABLE `aircraft`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tail_number` (`tail_number`);

--
-- Indexes for table `archive`
--
ALTER TABLE `archive`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_aircraft_date` (`aircraft_tail`,`snapshot_date`);

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`),
  ADD KEY `personnel_id` (`personnel_id`);

--
-- Indexes for table `personnel`
--
ALTER TABLE `personnel`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `aircraft_id` (`aircraft_id`);

--
-- Indexes for table `training`
--
ALTER TABLE `training`
  ADD PRIMARY KEY (`id`),
  ADD KEY `personnel_id` (`personnel_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `aircraft`
--
ALTER TABLE `aircraft`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `archive`
--
ALTER TABLE `archive`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `personnel`
--
ALTER TABLE `personnel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `training`
--
ALTER TABLE `training`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`),
  ADD CONSTRAINT `assignments_ibfk_2` FOREIGN KEY (`personnel_id`) REFERENCES `personnel` (`id`);

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`aircraft_id`) REFERENCES `aircraft` (`id`);

--
-- Constraints for table `training`
--
ALTER TABLE `training`
  ADD CONSTRAINT `training_ibfk_1` FOREIGN KEY (`personnel_id`) REFERENCES `personnel` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
