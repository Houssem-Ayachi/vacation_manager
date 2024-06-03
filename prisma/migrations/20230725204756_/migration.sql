/*
  Warnings:

  - You are about to drop the column `number_paid_leaves` on the `employees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Employees` DROP COLUMN `number_paid_leaves`,
    ADD COLUMN `paid_leaves` DOUBLE NOT NULL DEFAULT 0;
