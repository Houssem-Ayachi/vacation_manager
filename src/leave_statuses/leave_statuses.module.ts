import { Module } from '@nestjs/common';
import { LeaveStatusesController } from './leave_statuses.controller';
import { LeaveStatusesService } from './leave_statuses.service';

@Module({
  imports: [],
  controllers: [LeaveStatusesController],
  providers: [LeaveStatusesService]
})
export class LeaveStatusesModule {}
