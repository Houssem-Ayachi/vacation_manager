import { Module } from '@nestjs/common';
import { LeaveTypesController } from './leave_types.controller';
import { LeaveTypesService } from './leave_types.service';

@Module({
  imports: [],
  controllers: [LeaveTypesController],
  providers: [LeaveTypesService]
})
export class LeaveTypesModule {}
