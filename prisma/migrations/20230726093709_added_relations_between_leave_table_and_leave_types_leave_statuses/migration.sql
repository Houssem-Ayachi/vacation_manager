-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_leave_status_id_fkey` FOREIGN KEY (`leave_status_id`) REFERENCES `Leave_Statues`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_leave_type_id_fkey` FOREIGN KEY (`leave_type_id`) REFERENCES `Leave_Types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
