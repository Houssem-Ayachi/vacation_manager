-- DropForeignKey
ALTER TABLE `Contacts` DROP FOREIGN KEY `Contacts_contact_type_id_fkey`;

-- DropForeignKey
ALTER TABLE `Contacts` DROP FOREIGN KEY `Contacts_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `Leave` DROP FOREIGN KEY `Leave_admin_id_fkey`;

-- DropForeignKey
ALTER TABLE `Leave` DROP FOREIGN KEY `Leave_employee_id_fkey`;

-- DropForeignKey
ALTER TABLE `Leave` DROP FOREIGN KEY `Leave_leave_status_id_fkey`;

-- DropForeignKey
ALTER TABLE `Leave` DROP FOREIGN KEY `Leave_leave_type_id_fkey`;

-- AddForeignKey
ALTER TABLE `Contacts` ADD CONSTRAINT `Contacts_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employees`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contacts` ADD CONSTRAINT `Contacts_contact_type_id_fkey` FOREIGN KEY (`contact_type_id`) REFERENCES `Contact_Types`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_employee_id_fkey` FOREIGN KEY (`employee_id`) REFERENCES `Employees`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `Employees`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_leave_status_id_fkey` FOREIGN KEY (`leave_status_id`) REFERENCES `Leave_Statues`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_leave_type_id_fkey` FOREIGN KEY (`leave_type_id`) REFERENCES `Leave_Types`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
