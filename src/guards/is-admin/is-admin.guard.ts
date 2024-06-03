import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AdminLevels } from 'src/employee/employee.dto';

@Injectable()
export class IsAdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean{
    const request = context.switchToHttp().getRequest();
    const employee = request.employee;
    if(!employee){
      return false;
    }
    if(employee.admin_level === AdminLevels.EMPLOYEE){
      throw new UnauthorizedException();
    }
    return true;
  }
}
