import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { CreateEmployeeDTO, EmployeeData } from "../employee/employee.dto";
import { SignInObj } from './auth.dto';

import { EmployeeService } from 'src/employee/employee.service';
import { EmailerService } from 'src/emailer/emailer.service';

import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly empService: EmployeeService,
        private readonly emailer: EmailerService
    ){}

    private _resetPasswordRequests = new Map<string ,number>();

    private _randomMin = 100;
    private _randomMax = 999;
    private _verificationDuration = 120000; //how much a reset password code lasts in storage

    async signIn(signinObj: SignInObj){
        const employee = await this.empService.getEmployeeByEmail(signinObj.email);
        if(!employee){//if email is wrong or doesn't exist
            throw new BadRequestException("email doesn't exist");
        }
        const pwdMatch = await compare(signinObj.password, employee.password);
        if(!pwdMatch){
            throw new BadRequestException("wrong password");
        }
        return await this.createJWT(employee);
    }

    async createEmployeeAccount(signUpObj: CreateEmployeeDTO){
        const hashedPassword = await this.hashPasswrod(signUpObj.password);
        const employee: any = await this.empService.createEmployee({...signUpObj, password: hashedPassword});
        this.sendLoginInfoToEmployee({email: signUpObj.email, password: signUpObj.password});
        return employee;
    }

    async createSuperAdmin(signUpObj: CreateEmployeeDTO){
        const employeesCount = await this.empService.getEmployeesCount();
        if(employeesCount > 0){
            throw new UnauthorizedException();
        }
        signUpObj.password = await this.hashPasswrod(signUpObj.password);
        const superAdmin: EmployeeData = await this.empService.createEmployee(signUpObj);
        return await this.empService.makeSuperAdmin(superAdmin.id);
    }

    async resetPassword(employeeObj: EmployeeData, code: number, newPassword: string){
        if(this._resetPasswordRequests[employeeObj.email] !== undefined){
            const savedCode = this._resetPasswordRequests[employeeObj.email];
            if(savedCode === code){
                delete this._resetPasswordRequests[employeeObj.email];//delete request record
                newPassword = await this.hashPasswrod(newPassword);
                employeeObj.password = newPassword;
                this.empService.updateEmployee(employeeObj, employeeObj.id);
            }else{
                throw new BadRequestException("wrong code");
            }
        }else{
            throw new NotFoundException("code expired");
        }
    }

    async sendResetPasswordRequest(email: string){
        await this.checkEmployeeExists(email);
        const random = Math.round(Math.random() * (this._randomMax - this._randomMin) + this._randomMin);
        const htmlBody = `
            <div>
                <h3>Copy code below to reset your passowrd</h3>
                <p>CODE --> ${random}</p>
            </div>
        `;
        this._resetPasswordRequests[email] = random;
        new Promise(res => {
            setTimeout(() => {
                delete this._resetPasswordRequests[email];
                res("");
            }, this._verificationDuration);
        });
        this.emailer.sendEmail(email, "reset password", htmlBody);
    }

    private async createJWT(employee: any){
        const payload = {sub: employee.id, date: Date.now};
        return {
            accessToken: await this.jwtService.signAsync(payload)
        }
    }

    private async checkEmployeeExists(email: string){
        //check if employee exists
        const employee = await this.empService.getEmployeeByEmail(email);
        if(!employee){
            throw new BadRequestException("email does not exist");
        }
        return true;
    }

    private async hashPasswrod(password: string){
        return await hash(password, 10);
    }

    private async sendLoginInfoToEmployee(loginInfo: {email: string, password: string}){
        const html = `
            <div>
                <h1>Your Password</h1>
                <h3>${loginInfo.password}</h3>
            </div>
        `;
        const subject = "You Account Has Been Created";
        this.emailer.sendEmail(loginInfo.email, subject, html);
    }

}
