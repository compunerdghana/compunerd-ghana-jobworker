CREATE TABLE `activityLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`action` varchar(255) NOT NULL,
	`entityType` varchar(100),
	`entityId` int,
	`details` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activityLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('school','business','hotel','pharmacy','supermarket','individual') NOT NULL,
	`industry` varchar(255),
	`location` text,
	`contactPerson` varchar(255),
	`phone` varchar(20),
	`whatsapp` varchar(20),
	`email` varchar(320),
	`status` enum('lead','active','dormant') NOT NULL DEFAULT 'lead',
	`serviceAgreement` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `devices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('laptop','router','printer','cctv','server','switch','other') NOT NULL,
	`serialNumber` varchar(255),
	`model` varchar(255),
	`condition` enum('excellent','good','fair','poor') NOT NULL DEFAULT 'good',
	`purchasePrice` decimal(10,2),
	`repairCost` decimal(10,2) DEFAULT '0',
	`clientId` int,
	`warrantyExpiry` datetime,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `devices_id` PRIMARY KEY(`id`),
	CONSTRAINT `devices_serialNumber_unique` UNIQUE(`serialNumber`)
);
--> statement-breakpoint
CREATE TABLE `fieldEngineers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`phone` varchar(20),
	`specialization` varchar(255),
	`isOnDuty` boolean NOT NULL DEFAULT false,
	`lastCheckIn` timestamp,
	`lastCheckOut` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fieldEngineers_id` PRIMARY KEY(`id`),
	CONSTRAINT `fieldEngineers_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `financialRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int,
	`type` enum('revenue','expense','material','labour','transport') NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`description` text,
	`category` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `financialRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventoryItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(255),
	`quantity` int NOT NULL DEFAULT 0,
	`purchasePrice` decimal(10,2),
	`sellingPrice` decimal(10,2),
	`supplier` varchar(255),
	`reorderLevel` int NOT NULL DEFAULT 5,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `inventoryItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inventoryTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`itemId` int NOT NULL,
	`type` enum('in','out','damaged','transfer') NOT NULL,
	`quantity` int NOT NULL,
	`jobId` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inventoryTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `invoices` (
	`id` int AUTO_INCREMENT NOT NULL,
	`invoiceNumber` varchar(50) NOT NULL,
	`jobId` int,
	`clientId` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`status` enum('draft','sent','paid','overdue') NOT NULL DEFAULT 'draft',
	`dueDate` datetime,
	`paidDate` datetime,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `invoices_id` PRIMARY KEY(`id`),
	CONSTRAINT `invoices_invoiceNumber_unique` UNIQUE(`invoiceNumber`)
);
--> statement-breakpoint
CREATE TABLE `jobNotes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `jobNotes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketId` varchar(50) NOT NULL,
	`clientId` int NOT NULL,
	`issueType` varchar(255) NOT NULL,
	`description` text,
	`priority` enum('low','medium','high','emergency') NOT NULL DEFAULT 'medium',
	`status` enum('open','in_progress','resolved','closed') NOT NULL DEFAULT 'open',
	`assignedEngineerId` int,
	`costEstimate` decimal(10,2),
	`finalCost` decimal(10,2),
	`profit` decimal(10,2),
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`),
	CONSTRAINT `jobs_ticketId_unique` UNIQUE(`ticketId`)
);
--> statement-breakpoint
CREATE TABLE `payroll` (
	`id` int AUTO_INCREMENT NOT NULL,
	`staffId` int NOT NULL,
	`month` varchar(7) NOT NULL,
	`baseSalary` decimal(10,2) NOT NULL,
	`commission` decimal(10,2) DEFAULT '0',
	`bonuses` decimal(10,2) DEFAULT '0',
	`deductions` decimal(10,2) DEFAULT '0',
	`netPay` decimal(10,2) NOT NULL,
	`status` enum('pending','processed','paid') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `payroll_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `staff` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`role` enum('engineer','admin','sales','accountant','manager') NOT NULL,
	`phone` varchar(20),
	`salary` decimal(10,2),
	`commission` decimal(10,2) DEFAULT '0',
	`performanceScore` decimal(3,1) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `staff_id` PRIMARY KEY(`id`),
	CONSTRAINT `staff_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `workLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`engineerId` int NOT NULL,
	`jobId` int,
	`checkInTime` timestamp NOT NULL DEFAULT (now()),
	`checkOutTime` timestamp,
	`notes` text,
	`location` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `workLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','manager','field_engineer','finance') NOT NULL DEFAULT 'field_engineer';