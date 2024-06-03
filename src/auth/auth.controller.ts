import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';

import { CreateEmployeeDTO, EmployeeData } from "../employee/employee.dto";
import { ResetPasswordOBJ, SignInObj } from './auth.dto';
import { AuthService } from './auth.service';

import { JwtGuard } from 'src/guards/jwtguard/jwtguard.guard';
import { IsSuperAdminGuard } from 'src/guards/is-super-admin/is-super-admin.guard';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService,){}

    @Post("/signin")
    async signin(@Body() signinObj: SignInObj){
        return this.authService.signIn(signinObj);
    }

    @UseGuards(JwtGuard, IsSuperAdminGuard)
    @Post("/create_employee_account")
    async createEmployeeAccount(@Body() signUpObj: CreateEmployeeDTO){
        return await this.authService.createEmployeeAccount(signUpObj);
    }

    //this route is only supposed to be accessed when the application is first started and opened 
    //it's purpose is to add the first employee who opened it as a super admin
    @Post("/create_super_admin")
    async createFirstSuperAdmin(@Body() signUpObj: CreateEmployeeDTO){
        return await this.authService.createSuperAdmin(signUpObj);
    }

    @Get("/send_reset_password_request")
    @UseGuards(JwtGuard)
    async sendResetPasswordRequest(@Req() req: any){
        this.authService.sendResetPasswordRequest(req.employee.email);
    }

    @Post("/reset_password")
    @UseGuards(JwtGuard)
    async resetPassword(@Req() req: any, @Body() body: ResetPasswordOBJ){
        const employee = req.employee as EmployeeData;
        this.authService.resetPassword(employee, body.code, body.new_password);
    }

}
