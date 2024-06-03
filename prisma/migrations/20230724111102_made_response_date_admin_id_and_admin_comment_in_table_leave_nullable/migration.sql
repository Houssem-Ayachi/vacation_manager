-- DropForeignKey
ALTER TABLE `Leave` DROP FOREIGN KEY `Leave_admin_id_fkey`;

-- AlterTable
ALTER TABLE `Leave` MODIFY `response_date` DATETIME(3) NULL,
    MODIFY `admin_comment` VARCHAR(191) NULL,
    MODIFY `admin_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `Employees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
