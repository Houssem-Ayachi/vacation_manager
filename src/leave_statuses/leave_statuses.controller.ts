import { Controller, Post, UseGuards, Put, Delete, Get, Body, Param } from '@nestjs/common';
import { IsAdminGuard } from 'src/guards/is-admin/is-admin.guard';
import { JwtGuard } from 'src/guards/jwtguard/jwtguard.guard';
import { CreateStatusDTO } from './leave_statuses.dto';
import { LeaveStatusesService } from './leave_statuses.service';

@UseGuards(JwtGuard)
@Controller('leave-statuses')
export class LeaveStatusesController {

    constructor(private readonly leaveStatusService: LeaveStatusesService){}

    @Get("/")
    async getStatuses(){
        return await this.leaveStatusService.getStatuses();
    }

    @UseGuards(IsAdminGuard)
    @Post("/")
    async createStatus(@Body() body: CreateStatusDTO){
        return await this.leaveStatusService.createStatuses(body);
    }

    @UseGuards(IsAdminGuard)
    @Put("/")
    async updateStatus(@Body() body: CreateStatusDTO){
        return await this.leaveStatusService.updateStatus(body);
    }
    
    @UseGuards(IsAdminGuard)
    @Delete("/:id")
    async deleteStatus(@Param("id") id: string){
        return await this.leaveStatusService.deleteStatus(id);
    }
}
