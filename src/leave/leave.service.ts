import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateLeaveRequestDTO, LeaveRequestData, LeaveRequestReplyDTO, MonthLeaveQueryDTO, UpdateLeaveRequestDTO } from './leave.dto';
import { EmployeeData } from 'src/employee/employee.dto';

import { EmailerService } from 'src/emailer/emailer.service';
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class LeaveService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly emailer: EmailerService,
        private readonly empService: EmployeeService
    ){}

    async getPendingRequests(){
        return await this.prisma.leave.findMany({
            where: {leave_status_id: "pending"},
            include: {
                employee: {
                    select: {
                        id: true, 
                        name: true, 
                        last_name: true
                    }
                }
            }
        });
    }

    //TODO: make sure the employee making the request is not already in a leave
    async createLeaveRequest(data: CreateLeaveRequestDTO, employee: EmployeeData){
        if(await this.employeeHasPendingLeaveRequest(employee.id)){
            return new UnauthorizedException("you already have a pending request");
        }
        const start_date = new Date(data.start_date);
        const end_date = new Date(data.end_date);
        const today = new Date();
        const simpleToday = new Date(today.getFullYear(), today.getMonth(), today.getDay());
        if(start_date.getTime() < simpleToday.getTime()){
            throw new BadRequestException("can't take leave in the past");
        }
        //check whether this employee is allowed to take number of leave days desired, if not throw an error
        this.canTakeLeave(start_date, end_date, employee);
        const request = await this.prisma.leave.create({data: {
            start_date,
            end_date,
            employee_comment: data.employee_comment,
            leave_type_id: data.leave_type_id,
            employee_id: employee.id
        }});
        this.informSuperAdminsAboutRequest(request, employee, false);
        return request;
    }

    async updateLeaveRequest(data: UpdateLeaveRequestDTO){
        const employee = await this.empService.getEmployeeById(data.employee_id);
        if(!employee) throw new BadRequestException("employee does not exist");
        const start_date = new Date(data.start_date);
        const end_date = new Date(data.end_date);
        //check whether this employee is allowed to take number of leave days desired, if not throw an error
        this.canTakeLeave(start_date, end_date, employee);
        const request = await this.prisma.leave.update({
            where: {
             id: data.id
            },
            data: {
                start_date,
                end_date,
                employee_comment: data.employee_comment,
                leave_type_id: data.leave_type_id,
                employee_id: data.employee_id
            }
        });
        this.informSuperAdminsAboutRequest(request, employee, true);
        return request;
    }

    async deleteLeaveRequest(leave_id: number, employee: EmployeeData){
        const leaveRequest = await this.prisma.leave.findFirst({where: {id: leave_id}});
        if(!leaveRequest){
            throw new BadRequestException("this leave request doesn't exist");
        }
        //check if the request came from the same employee who made it or from an admin (simple or super admin)
        if(leaveRequest.employee_id === employee.id || employee.admin_level === 2){
            return await this.prisma.leave.delete({where: {id: leave_id}});
        }
        throw new UnauthorizedException();
    }

    async getEmployeesLeaveHistory(){
        const history = await this.prisma.leave.findMany({
            include: {
                leave_status: true,
                leave_type: true,
                employee: {
                    select: {name: true, last_name: true, email: true, id: true}
                },
                admin: {
                    select: {name: true, last_name: true, email: true, id: true}
                }
            }
        });
        const historyMap = {};
        for(let record of history){
            if(historyMap[record.employee.id]){
                historyMap[record.employee.id].push(record);
                continue;
            }
            historyMap[record.employee.id] = [record];
        }
        return historyMap
    }

    async getEmployeeLeaveHistory(employee_id: number){
        const history = await this.prisma.leave.findMany({
            where: {
                employee_id,
                NOT: {leave_status_id: "pending"}
            }, 
            include: {
                leave_status: true, 
                leave_type: true,
                admin: {
                    select: {name: true, last_name: true, email: true, id: true}
                },
                employee: {
                    select: {id: true, name: true, last_name: true}
                }
            }
        });
        return {
            history
        }
    }

    async getEmployeeBalance(employee_id: number){
        const balance = await this.prisma.leave.findMany({
            where: {
                employee_id, 
                leave_status_id: "accepted"
            },
        });
        let result = new Map<string, number>();
        for(let i of balance){
            if(result.has(i.leave_type_id)){
                result.set(i.leave_type_id, result.get(i.leave_type_id)+1);
            }
            else{
                result.set(i.leave_type_id, 1);
            }
        }
        return Object.fromEntries(result);
    }

    async isInLeave(employee_id: number){
        const leaves = (await this.prisma.leave.findMany({
            where: {
                employee_id,
                leave_status_id: "accepted"
            },
            orderBy: {
                created_at: "desc"
            }
        }));
        const latestLeave = leaves[0];
        //if no entries were found
        if(latestLeave === undefined){
            return {
                isInLeave: false
            };
        }
        const dateToday = new Date();
        const today = new Date(dateToday.getFullYear(), dateToday.getMonth(), dateToday.getDate()+1).getTime();
        const from = new Date(latestLeave.start_date).getTime();
        const to = new Date(latestLeave.end_date).getTime();
        return {
            isInLeave: today >= from && today <= to
        };
    }

    async replyToEmployeeLeaveRequest(data: LeaveRequestReplyDTO, superAdmin: EmployeeData){
        if(data.leave_status_id === "accepted"){
            //if admin accepted the leave request then subtract requested leave days from employee's total leave days
            const request = await this.prisma.leave.findFirst({where: {id: data.id}});
            const leaveDays = this.getNumberOfDays(request.start_date, request.end_date);
            this.empService.decrementPaidLeaves(leaveDays, request);
        }
        const request = await this.prisma.leave.update({
            where: {id: data.id},
            data: {
                ...data,
                response_date: new Date(),
                admin_id: superAdmin.id
            },
            include: {
                employee: {
                    select: {
                        email: true
                    }
                }
            }
        });
        this.informEmployeeAboutLeaveRequestReply(request.leave_status_id, superAdmin, request.admin_comment, request.employee.email);
        return request;
    }

    async getMonthLeaves({searchDate}: MonthLeaveQueryDTO){
        const date = new Date(searchDate);
        const nextMonth = new Date(date.getFullYear(), date.getMonth()+1, date.getDay());
        const response = await this.prisma.leave.findMany({
            where: {
                start_date: {
                    gte: date,
                    lte: nextMonth
                },
                leave_status_id: "accepted"
            },
            include: {employee: {select: {name: true, last_name: true, id: true}}}
        });
        return response;
    }

    private async employeeHasPendingLeaveRequest(employeeID: number){
        const response = await this.prisma.leave.findFirst({where: {employee_id: employeeID, response_date: null}});
        return response !== null;
    }

    //TODO: add to the html constant a link to send the super admin to a reply page (front end)
    private async informSuperAdminsAboutRequest(requestData: LeaveRequestData | UpdateLeaveRequestDTO, employee: EmployeeData, isUpdated: boolean){
        const superAdmins = await this.empService.getAllSuperAdmins();
        const subject = !isUpdated ? "New Leave Request" : "Updated Leave Request"
        const HTML = `
            <div>
                <h1>A leave request has been issued to you by ${employee.name} ${employee.last_name}</h1>
                <h3>Start Date: ${requestData.start_date}</h3>
                <h3>End Date: ${requestData.end_date}</h3>
                <h3>Comment:</h3>
                <p>${requestData.employee_comment}</p>
            </div>
        `
        superAdmins.forEach(superAdmin => {
            this.emailer.sendEmail(superAdmin.email, subject, HTML);
        });
    }

    private informEmployeeAboutLeaveRequestReply(status: string, superAdmin: EmployeeData, comment: string, employeeEmail: string){
        const subject = "Your Leave Request Has Been Replied To";
        const HTML = `
            <h1>${status}</h1>
            <h3>By ${superAdmin.name + " " + superAdmin.last_name}</h3>
            <h3>Comment:</h3>
            <p>${comment}</p>
        `
        this.emailer.sendEmail(employeeEmail, subject, HTML);
    }

    private getNumberOfDays(startDate: Date, endDate: Date){
        const timeDiff = endDate.getTime() - startDate.getTime();
        if(timeDiff < 0){
            throw new BadRequestException("Start date has to be before end date");
        }
        const leaveDays = timeDiff / (1000 * 3600 * 24) // since leaveDays is in milliseconds and it represents the days in milliseconds just divide it by how many milliseconds in a day to get number of days
        return leaveDays;
    }

    private canTakeLeave(start_date: Date, end_date: Date, employee: EmployeeData){
        //calculate number of leave days;
        const leaveDays = this.getNumberOfDays(start_date, end_date)
        //check whether this employee has less paid leave days than he needs
        if(leaveDays > employee.paid_leaves){
            throw new BadRequestException("requested leave days is more than what you have.")
        }
    }
}
