import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { EmailerModule } from './emailer/emailer.module';
import { LeaveStatusesModule } from './leave_statuses/leave_statuses.module';
import { LeaveTypesModule } from './leave_types/leave_types.module';
import { ContactsTypesModule } from './contacts_types/contacts_types.module';
import { ContactsModule } from './contacts/contacts.module';
import { LeaveModule } from './leave/leave.module';

@Module({
  imports: [
    EmployeeModule, 
    PrismaModule, 
    AuthModule, 
    EmailerModule, 
    LeaveStatusesModule, 
    LeaveTypesModule, 
    ContactsTypesModule, 
    ContactsModule, 
    LeaveModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
