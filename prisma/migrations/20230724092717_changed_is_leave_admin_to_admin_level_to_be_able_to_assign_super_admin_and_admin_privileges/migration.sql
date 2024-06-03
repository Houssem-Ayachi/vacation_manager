/*
  Warnings:

  - You are about to drop the column `is_leave_admin` on the `employees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Employees` DROP COLUMN `is_leave_admin`,
    ADD COLUMN `admin_level` INTEGER NOT NULL DEFAULT 0;
