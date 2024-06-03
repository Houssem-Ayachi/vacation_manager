/*
  Warnings:

  - You are about to drop the `_contact_typestocontacts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_Contact_TypesToContacts` DROP FOREIGN KEY `_Contact_TypesToContacts_A_fkey`;

-- DropForeignKey
ALTER TABLE `_Contact_TypesToContacts` DROP FOREIGN KEY `_Contact_TypesToContacts_B_fkey`;

-- DropTable
DROP TABLE `_Contact_TypesToContacts`;

-- AddForeignKey
ALTER TABLE `Contacts` ADD CONSTRAINT `Contacts_contact_type_id_fkey` FOREIGN KEY (`contact_type_id`) REFERENCES `Contact_Types`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
