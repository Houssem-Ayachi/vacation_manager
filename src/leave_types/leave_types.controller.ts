import { Controller, UseGuards, Get, Put, Delete, Post, Body, Param } from '@nestjs/common';
import { IsAdminGuard } from 'src/guards/is-admin/is-admin.guard';
import { JwtGuard } from 'src/guards/jwtguard/jwtguard.guard';
import { LeaveTypesService } from './leave_types.service';
import { CreateLeaveTypeDTO } from './leave_types.dto';

@UseGuards(JwtGuard)
@Controller('leave-types')
export class LeaveTypesController {

    constructor(private readonly leaveTypesService: LeaveTypesService){}

    @Get("/")
    async get(){
        return await this.leaveTypesService.getLeaveTypes();
    }
    @UseGuards(IsAdminGuard)
    @Post("/")
    async create(@Body() body: CreateLeaveTypeDTO){
        return await this.leaveTypesService.createLeaveType(body);
    }
    @UseGuards(IsAdminGuard)
    @Put("/")
    async update(@Body() body: CreateLeaveTypeDTO){
        return await this.leaveTypesService.updateLeaveType(body);
    }
    @UseGuards(IsAdminGuard)
    @Delete("/:id")
    async delete(@Param("id") id: string){
        return await this.leaveTypesService.deleteLeaveType(id);
    }
}
