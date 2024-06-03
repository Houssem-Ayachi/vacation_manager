import { Body, Controller, Delete, Get, Post, Put, Req, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { IsAdminGuard } from 'src/guards/is-admin/is-admin.guard';
import { IsSuperAdminGuard } from 'src/guards/is-super-admin/is-super-admin.guard';
import { JwtGuard } from 'src/guards/jwtguard/jwtguard.guard';
import { CreateLeaveRequestDTO, LeaveRequestReplyDTO, MonthLeaveQueryDTO, UpdateLeaveRequestDTO } from './leave.dto';
import { LeaveService } from './leave.service';
import { EmployeeData } from 'src/employee/employee.dto';

@UseGuards(JwtGuard)
@Controller('leave')
export class LeaveController {

    constructor(private readonly leaveService: LeaveService){}

    @UseGuards(IsAdminGuard)
    @Get("/requests")
    async getPendingRequests(){
        return await this.leaveService.getPendingRequests();
    }

    @Get("/")
    async getEmployeesLeaveHistory(){
        return await this.leaveService.getEmployeesLeaveHistory();
    }

    @Get("/is_in_leave/:employee_id")
    async isInLeave(@Param("employee_id", ParseIntPipe) employee_id: number){
        return await this.leaveService.isInLeave(employee_id);
    }

    @Post("/")
    async createLeaveRequest(@Body() body: CreateLeaveRequestDTO, @Req() req: any){
        return await this.leaveService.createLeaveRequest(body, req.employee)
    }

    @Put("/")
    async updateLeaveRequest(@Body() body: UpdateLeaveRequestDTO){
        return await this.leaveService.updateLeaveRequest(body);
    }

    @Delete("/:id")
    //this route doesn't use a IsSuperAdmin guard because inside the service function we check whether this route is being 
    //accessed by the employee who made the request or a super admin
    async deleteLeaveRequest(@Param('id', ParseIntPipe) leave_id: number, @Req() req: any){
        const employee = req.employee as EmployeeData;
        return await this.leaveService.deleteLeaveRequest(leave_id, employee);
    }

    @Get("/:employee_id")//NOTE: not sure if all employees should know about others' history or not
    async getEmployeeLeaveHistory(@Param("employee_id", ParseIntPipe) employee_id: number){
        return await this.leaveService.getEmployeeLeaveHistory(employee_id);
    }

    @Get("/balance/:employee_id")
    async getEmployeeBalance(@Param("employee_id", ParseIntPipe) employee_id: number){
        return await this.leaveService.getEmployeeBalance(employee_id);
    }

    @UseGuards(IsSuperAdminGuard)
    @Post("/reply")
    async replyToEmployeeLeaveRequest(@Body() body: LeaveRequestReplyDTO, @Req() req: any){
        return await this.leaveService.replyToEmployeeLeaveRequest(body, req.employee);
    }

    @Post("/month_leaves")
    async getMonthLeaves(@Body() body: MonthLeaveQueryDTO){
        return await this.leaveService.getMonthLeaves(body);
    }
}
