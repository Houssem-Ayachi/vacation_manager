/*
  Warnings:

  - You are about to drop the column `id` on the `contact_types` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `leave_types` table. All the data in the column will be lost.
  - You are about to drop the `leave_statues` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[type]` on the table `Contact_Types` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[type]` on the table `Leave_Types` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `contacts` DROP FOREIGN KEY `Contacts_contact_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `leave` DROP FOREIGN KEY `Leave_leave_status_id_fkey`;

-- DropForeignKey
ALTER TABLE `leave` DROP FOREIGN KEY `Leave_leave_type_id_fkey`;

-- DropIndex
DROP INDEX `Contact_Types_id_key` ON `contact_types`;

-- DropIndex
DROP INDEX `Leave_Types_id_key` ON `leave_types`;

-- AlterTable
ALTER TABLE `contact_types` DROP COLUMN `id`;

-- AlterTable
ALTER TABLE `leave_types` DROP COLUMN `id`;

-- DropTable
DROP TABLE `leave_statues`;

-- CreateTable
CREATE TABLE `Leave_Statuses` (
    `label` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Leave_Statuses_label_key`(`label`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Contact_Types_type_key` ON `Contact_Types`(`type`);

-- CreateIndex
CREATE UNIQUE INDEX `Leave_Types_type_key` ON `Leave_Types`(`type`);

-- AddForeignKey
ALTER TABLE `Contacts` ADD CONSTRAINT `Contacts_contact_type_id_fkey` FOREIGN KEY (`contact_type_id`) REFERENCES `Contact_Types`(`type`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_leave_status_id_fkey` FOREIGN KEY (`leave_status_id`) REFERENCES `Leave_Statuses`(`label`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_leave_type_id_fkey` FOREIGN KEY (`leave_type_id`) REFERENCES `Leave_Types`(`type`) ON DELETE CASCADE ON UPDATE CASCADE;
