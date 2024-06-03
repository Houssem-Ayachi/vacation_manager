import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JwtService } from "@nestjs/jwt";
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class JwtGuard implements CanActivate {

  constructor(
    private readonly jwtService: JwtService,
    private readonly empService: EmployeeService
  ){}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if(!token){
      throw new UnauthorizedException();
    }
    try{
      //extracting employee's info from the token, if token isn't present throw unauthorized exception (employee not logged in)
      const payload = await this.jwtService.verifyAsync(token, {
        secret: new ConfigService().get("JWT_SECRET")
      });
      //fetching corresponding employee and inserting the result inside the request itself (to extract it at any route desired)
      const employee = await this.empService.getEmployeeById(payload['sub']);
      request["employee"] = employee;
    }catch{
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const token: string = request.headers.authorization;
    return token.split(" ")[1];
  }

}
