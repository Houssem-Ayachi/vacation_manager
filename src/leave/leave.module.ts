import { Module } from '@nestjs/common';
import { LeaveController } from './leave.controller';
import { LeaveService } from './leave.service';
import { EmailerModule } from 'src/emailer/emailer.module';
import { EmployeeModule } from 'src/employee/employee.module';

@Module({
  imports: [EmailerModule, EmployeeModule],
  controllers: [LeaveController],
  providers: [LeaveService]
})
export class LeaveModule {}
