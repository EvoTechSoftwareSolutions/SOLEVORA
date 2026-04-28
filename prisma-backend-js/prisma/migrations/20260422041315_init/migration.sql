-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'store_manager', 'customer') NOT NULL DEFAULT 'customer',
    `phone` VARCHAR(20) NULL,
    `location` VARCHAR(255) NULL,
    `streetAddress` VARCHAR(255) NULL,
    `city` VARCHAR(100) NULL,
    `postalCode` VARCHAR(20) NULL,
    `country` VARCHAR(100) NULL,
    `newsletter` BOOLEAN NOT NULL DEFAULT true,
    `pushNotifications` BOOLEAN NOT NULL DEFAULT true,
    `usageReports` BOOLEAN NOT NULL DEFAULT false,
    `status` INTEGER NOT NULL DEFAULT 1,
    `lastLogin` DATETIME(3) NULL,
    `resetToken` VARCHAR(191) NULL,
    `resetTokenExpires` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
