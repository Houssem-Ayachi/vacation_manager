/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Employees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updated_at` to the `Contact_Types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Leave_Statues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Leave_Types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Contact_Types` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Contacts` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Employees` ADD COLUMN `is_verified` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `is_leave_admin` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Leave` MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Leave_Statues` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Leave_Types` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updated_at` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Employees_email_key` ON `Employees`(`email`);
