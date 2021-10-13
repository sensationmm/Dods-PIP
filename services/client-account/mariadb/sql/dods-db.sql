SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP DATABASE IF EXISTS `dods`;
CREATE DATABASE `dods` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `dods`;

DROP TABLE IF EXISTS `dods_client_accounts`;
CREATE TABLE `dods_client_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `subscription` int(11) DEFAULT NULL,
  `subscription_seats` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `notes` text DEFAULT NULL,
  `contact_name` varchar(100) NOT NULL,
  `contact_email_address` varchar(100) NOT NULL,
  `contact_telephone_number` varchar(20) NOT NULL,
  `consultant_hours` int(11) DEFAULT NULL,
  `contract_start_date` datetime DEFAULT NULL,
  `contract_end_date` datetime DEFAULT NULL,
  `contract_rollover` tinyint(1) DEFAULT NULL,
  `sales_contact` int(11) DEFAULT NULL,
  `is_completed` tinyint(1) NOT NULL DEFAULT 0,
  `last_step_completed` int(11) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_sales_contact_user_id_idx` (`sales_contact`),
  KEY `FK_subscription_type_id` (`subscription`),
  CONSTRAINT `FK_sales_contact_user_id` FOREIGN KEY (`sales_contact`) REFERENCES `dods_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_subscription_type_id` FOREIGN KEY (`subscription`) REFERENCES `dods_subscription_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `dods_client_account_tags`;
CREATE TABLE `dods_client_account_tags` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `client_account_id` int(11) DEFAULT NULL,
  `tag_type` int(11) NOT NULL,
  `tag_id` text NOT NULL,
  `tag_text` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `client_account_id` (`client_account_id`),
  CONSTRAINT `dods_client_account_tags_ibfk_1` FOREIGN KEY (`client_account_id`) REFERENCES `dods_client_accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `dods_client_account_teams`;
CREATE TABLE `dods_client_account_teams` (
  `client_account_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `team_member_type` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  KEY `user_id` (`user_id`),
  KEY `client_account_id` (`client_account_id`),
  CONSTRAINT `dods_client_account_teams_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `dods_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dods_client_account_teams_ibfk_2` FOREIGN KEY (`client_account_id`) REFERENCES `dods_client_accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `dods_client_account_users`;
CREATE TABLE `dods_client_account_users` (
  `client_account_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_type` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  KEY `client_account_id` (`client_account_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `dods_client_account_users_ibfk_1` FOREIGN KEY (`client_account_id`) REFERENCES `dods_client_accounts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dods_client_account_users_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `dods_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `dods_projects`;
CREATE TABLE `dods_projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `title` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `dods_project_dates`;
CREATE TABLE `dods_project_dates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `project_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `date` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `dods_project_dates_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `dods_projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `dods_project_users`;
CREATE TABLE `dods_project_users` (
  `project_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `project_role` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  KEY `project_id` (`project_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `dods_project_users_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `dods_projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dods_project_users_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `dods_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `dods_roles`;
CREATE TABLE `dods_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `title` varchar(45) NOT NULL,
  `dods_role` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `dods_subscription_types`;
CREATE TABLE `dods_subscription_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `location` int(11) DEFAULT NULL,
  `content_type` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `dods_tasks`;
CREATE TABLE `dods_tasks` (
  `int` int(11) NOT NULL,
  `uuid` varchar(36) NOT NULL,
  `description` varchar(200) NOT NULL,
  `created_by` int(11) NOT NULL,
  `assigned_to` int(11) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `due_at` datetime NOT NULL,
  `completed_at` datetime DEFAULT NULL,
  `status` int(11) NOT NULL,
  KEY `created_by` (`created_by`),
  KEY `assigned_to` (`assigned_to`),
  CONSTRAINT `dods_tasks_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `dods_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dods_tasks_ibfk_2` FOREIGN KEY (`assigned_to`) REFERENCES `dods_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `dods_users`;
CREATE TABLE `dods_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uuid` varchar(36) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `title` varchar(150) NOT NULL,
  `primary_email` varchar(100) NOT NULL,
  `secondary_email` varchar(100) DEFAULT NULL,
  `telephone_number_1` varchar(20) DEFAULT NULL,
  `telephone_number_2` varchar(20) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL,
  `deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_user_role_id_idx` (`role_id`),
  CONSTRAINT `FK_user_role_id` FOREIGN KEY (`role_id`) REFERENCES `dods_roles` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;