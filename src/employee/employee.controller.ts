import { Controller, Post, Body, Get, Put, Param, ParseIntPipe, Delete, Query, UseGuards, Req } from '@nestjs/common';

import { CreateEmployeeDTO, UpdateEmployeeDTO } from './employee.dto';
import { EmployeeService } from './employee.service';
import { JwtGuard } from 'src/guards/jwtguard/jwtguard.guard';
import { IsAdminGuard } from 'src/guards/is-admin/is-admin.guard';
import { IsSuperAdminGuard } from 'src/guards/is-super-admin/is-super-admin.guard';

@Controller('employee')
export class EmployeeController {

    constructor(private readonly empService: EmployeeService){}

    @Get("/")
    async getAllEmployees(@Query() query: any){//NOTE: example /?id=1 or /?email=exampleEmail@host.domain (only first one query will work if two are present)        
        if(query.id){
            return await this.empService.getEmployeeById(parseInt(query.id));
        }else if(query.email){
            return await this.empService.getEmployeeByEmail(query.email);
        }
        return await this.empService.getAllEmployees();
    }

    @Get("/count")
    async getEmployeesCount(){
        return await this.empService.getEmployeesCount();
    }

    @UseGuards(JwtGuard)
    @Get("/current_session_employee_data")
    async getCurrentSessionEmployee(@Req() req: any){
        return req.employee;
    }

    @UseGuards(JwtGuard, IsAdminGuard)
    @Put("/:id")
    async updateEmployee(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateEmployeeDTO){
        return await this.empService.updateEmployee(body, id);
    }

    @Post("/")
    async createEmployee(@Body() body: CreateEmployeeDTO){
        return await this.empService.createEmployee(body);
    }

    @UseGuards(JwtGuard, IsAdminGuard)
    @Delete("/:id")
    async deleteEmplyee(@Param('id', ParseIntPipe) id: number){
        return await this.empService.deleteEmployee(id);
    }

    @UseGuards(JwtGuard, IsSuperAdminGuard)
    @Put("/make_admin/:id")
    async makeEmployeeAdmin(@Param('id', ParseIntPipe) id: number){
        return await this.empService.makeEmployeeAdmin(id);
    }

    @UseGuards(JwtGuard, IsSuperAdminGuard)
    @Put("/update_to_simple_employee/:id")
    async updateToSimpleEmployee(@Param("id", ParseIntPipe) id: number){
        return await this.empService.updateToSimpleEmployee(id);
    }
}
