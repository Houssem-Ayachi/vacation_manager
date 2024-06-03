import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { ContactsTypesModule } from 'src/contacts_types/contacts_types.module';

@Module({
  imports: [ContactsTypesModule],
  controllers: [ContactsController],
  providers: [ContactsService]
})
export class ContactsModule {}
