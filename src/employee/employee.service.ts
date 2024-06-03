import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateEmployeeDTO, EmployeePublicData, EmployeeData, AdminLevels, UpdateEmployeeDTO } from './employee.dto';
import { LeaveRequestData } from 'src/leave/leave.dto';

@Injectable()
export class EmployeeService {

    constructor(private prisma: PrismaService){}

    async createEmployee(employeeObj: CreateEmployeeDTO){
        const find = await this.prisma.employees.findFirst({where: {email: employeeObj.email}});
        if(find){
            throw new BadRequestException("employee with this email exists");
        }
        const employee = await this.prisma.employees.create({
            data: {
                name: employeeObj.name,
                last_name: employeeObj.last_name,
                email: employeeObj.email,
                password: employeeObj.password,
                phone_number: employeeObj.phone_number,
                cnss: employeeObj.cnss,
                birth_date: new Date(employeeObj.birth_date),
                joined_date: new Date(employeeObj.joined_date),
                exit_date: new Date(employeeObj.exit_date),
            }
        });
        return employee;
    }

    async getAllEmployees(){
        const employees = await this.prisma.employees.findMany({select: {
            id: true,
            name: true,
            last_name: true,
            email: true,
            phone_number: true,
            birth_date: true,
            joined_date: true,
            exit_date: true,
            admin_level: true,
            is_verified: true,
            paid_leaves: true,
        }});
        return employees;
    }

    async updateEmployee(employeeObj: UpdateEmployeeDTO, id: number){
        const employee = await this.prisma.employees.update({
            where: {id},
            data: {
                ...employeeObj
            }
        });
        return employee;
    }

    async getEmployeeById(id: number){
        const employee = await this.prisma.employees.findFirst({
            where: {id}
        });
        return employee;
    }

    async getEmployeeByEmail(email: string){
        const employee = await this.prisma.employees.findFirst({
            where: {email}
        });
        return employee;
    }

    async deleteEmployee(id: number){
        return await this.prisma.employees.delete({
            where: {id}
        });
    }

    async makeEmployeeAdmin(id: number){
        return await this.prisma.employees.update({
            where: {id},
            data: {
                admin_level: AdminLevels.ADMIN
            }
        });
    }

    async updateToSimpleEmployee(id: number){
        return await this.prisma.employees.update({
            where: {id},
            data: {
                admin_level: 0
            }
        });
    }

    async getEmployeesCount(){
        return await this.prisma.employees.count();
    }

    async hideEmployeeSensitiveData(employee: any) : Promise<EmployeePublicData>{
        const {password, cnss, ...result} = employee;
        return result;
    }

    async markEmployeeAsVerified(email: string){
        await this.prisma.employees.update({
            where: {email},
            data: {
                is_verified: true
            }
        });
    }

    async incrementPaidLeaves(){
        return await this.prisma.$executeRaw`update Employees set number_paid_leaves = number_paid_leaves + 1.75`;
    }

    async makeSuperAdmin(employee_id: number){
        return await this.prisma.employees.update({
            where: {id: employee_id},
            data: {
                admin_level: 2
            }
        })
    }

    async getAllSuperAdmins(){
        return await this.prisma.employees.findMany({
            where: {
                admin_level: AdminLevels.SUPER_ADMIN
            }
        });
    }

    //this function is used to decrement number of paid leaves an employee has when a super admin accepts his request for a leave
    async decrementPaidLeaves(leaveDays: number, request: LeaveRequestData){
        //if admin accepted the leave request then subtract requested leave days from employee's total leave days
        const employee = await this.prisma.employees.findFirst({where: {id: request.employee_id}});
        return await this.prisma.employees.update({
            where: {
                id: request.employee_id
            },
            data: {
                paid_leaves: employee.paid_leaves - leaveDays,
            }
        });
    }

}
