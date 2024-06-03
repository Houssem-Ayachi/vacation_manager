import { Module } from '@nestjs/common';
import { ContactsTypesController } from './contacts_types.controller';
import { ContactsTypesService } from './contacts_types.service';

@Module({
  controllers: [ContactsTypesController],
  providers: [ContactsTypesService],
  exports: [ContactsTypesService]
})
export class ContactsTypesModule {}
