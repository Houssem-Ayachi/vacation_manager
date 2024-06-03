import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStatusDTO } from './leave_statuses.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LeaveStatusesService {

    constructor(private readonly prisma: PrismaService){}

    async getStatuses(){
        return await this.prisma.leave_Statuses.findMany();
    }

    async createStatuses(data: CreateStatusDTO){
        const status = await this.prisma.leave_Statuses.findFirst({where: {label: data.label}});
        if(status) throw new BadRequestException("Status already exists");
        return await this.prisma.leave_Statuses.create({
            data: {
                label: data.label,
            }
        });
    }

    async updateStatus( data: CreateStatusDTO){
        const status = await this.prisma.leave_Statuses.findFirst({where: {label: data.label}});
        if(!status) throw new BadRequestException("Status with given id does not exist");
        return await this.prisma.leave_Statuses.update({
            where: {label: data.label},
            data: {
                label: data.label,
            }
        });
    }

    async deleteStatus(label: string){
        const status = await this.prisma.leave_Statuses.findFirst({where: {label}});
        if(!status) throw new BadRequestException("Status with given id does not exist");
        return await this.prisma.leave_Statuses.delete({where: {label}});
    }

}
