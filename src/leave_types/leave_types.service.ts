import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLeaveTypeDTO } from './leave_types.dto';

@Injectable()
export class LeaveTypesService {

    constructor(private readonly prisma: PrismaService){}

    async getLeaveTypes(){
        return await this.prisma.leave_Types.findMany();
    }

    async createLeaveType(data: CreateLeaveTypeDTO){
        const leaveType = await this.prisma.leave_Types.findFirst({where: {type: data.type}});
        if(leaveType) throw new BadRequestException("Type already exists");
        return await this.prisma.leave_Types.create({
            data
        });
    }

    async updateLeaveType(data: CreateLeaveTypeDTO){
        const leaveType = await this.prisma.leave_Types.findFirst({where: {type: data.type}});
        if(!leaveType) throw new BadRequestException("Type does not exist");
        return await this.prisma.leave_Types.update({
            where: {type: data.type},
            data
        });
    }

    async deleteLeaveType(type: string){
        const leaveType = await this.prisma.leave_Types.findFirst({where: {type}});
        if(!leaveType) throw new BadRequestException("Type does not exist");
        return await this.prisma.leave_Types.delete({
            where: {type}
        });
    }

}
