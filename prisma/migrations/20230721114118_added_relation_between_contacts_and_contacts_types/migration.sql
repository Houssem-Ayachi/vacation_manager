/*
  Warnings:

  - Added the required column `contact_type_id` to the `Contacts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Contacts` ADD COLUMN `contact_type_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `_Contact_TypesToContacts` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_Contact_TypesToContacts_AB_unique`(`A`, `B`),
    INDEX `_Contact_TypesToContacts_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_Contact_TypesToContacts` ADD CONSTRAINT `_Contact_TypesToContacts_A_fkey` FOREIGN KEY (`A`) REFERENCES `Contact_Types`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Contact_TypesToContacts` ADD CONSTRAINT `_Contact_TypesToContacts_B_fkey` FOREIGN KEY (`B`) REFERENCES `Contacts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
