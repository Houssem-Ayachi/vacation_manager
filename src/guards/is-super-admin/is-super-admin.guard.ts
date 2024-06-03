import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminLevels } from 'src/employee/employee.dto';

@Injectable()
export class IsSuperAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const req = context.switchToHttp().getRequest();
    const employee = req.employee;
    if(!employee) throw new UnauthorizedException();
    return employee.admin_level === AdminLevels.SUPER_ADMIN;
  }
}
