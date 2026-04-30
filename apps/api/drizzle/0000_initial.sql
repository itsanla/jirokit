CREATE TABLE `Event` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`emoji` text NOT NULL,
	`target` text NOT NULL,
	`description` text NOT NULL,
	`benefits` text NOT NULL,
	`normal_price` integer NOT NULL,
	`event_price` integer NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Event_slug_unique` ON `Event` (`slug`);--> statement-breakpoint
CREATE TABLE `PromoCode` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer,
	`code` text NOT NULL,
	`description` text,
	`discount_type` text NOT NULL,
	`discount_value` integer DEFAULT 0 NOT NULL,
	`max_uses` integer,
	`current_uses` integer DEFAULT 0 NOT NULL,
	`valid_until` integer,
	`is_active` integer DEFAULT 1 NOT NULL,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `PromoCode_code_unique` ON `PromoCode` (`code`);--> statement-breakpoint
CREATE TABLE `Quota` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`event_id` integer NOT NULL,
	`total_slots` integer DEFAULT 0 NOT NULL,
	`remaining_slots` integer DEFAULT 0 NOT NULL,
	`updatedAt` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `Event`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `Quota_event_id_unique` ON `Quota` (`event_id`);