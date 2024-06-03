import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class IsVerifiedGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const req = context.switchToHttp().getRequest();
    const employee = req['employee'];
    if(!employee.is_verified){
      throw new UnauthorizedException("email not verified");
    }
    return true;
  }
}
