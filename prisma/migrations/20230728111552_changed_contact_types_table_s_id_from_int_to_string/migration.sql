/*
  Warnings:

  - The primary key for the `contact_types` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[id]` on the table `Contact_Types` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Contacts` DROP FOREIGN KEY `Contacts_contact_type_id_fkey`;

-- AlterTable
ALTER TABLE `Contact_Types` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `Contacts` MODIFY `contact_type_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Contact_Types_id_key` ON `Contact_Types`(`id`);

-- AddForeignKey
ALTER TABLE `Contacts` ADD CONSTRAINT `Contacts_contact_type_id_fkey` FOREIGN KEY (`contact_type_id`) REFERENCES `Contact_Types`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
