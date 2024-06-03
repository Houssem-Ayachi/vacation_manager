/*
  Warnings:

  - You are about to alter the column `number_paid_leaves` on the `employees` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `Employees` MODIFY `number_paid_leaves` DOUBLE NOT NULL DEFAULT 0;
