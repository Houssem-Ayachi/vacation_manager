import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { CreateContactTypeDTO, UpdateContactTypeDTO } from './contacts_types.dto';

@Injectable()
export class ContactsTypesService {

    constructor(private readonly prisma: PrismaService){}

    async getContactTypes(){
        return await this.prisma.contact_Types.findMany();
    }

    async createContactType(data: CreateContactTypeDTO){
        const contact = await this.prisma.contact_Types.findFirst({where: {type: data.type}});
        if(contact) throw new BadRequestException("Contact already exists");
        return await this.prisma.contact_Types.create({
            data
        });
    }

    async updateContactType(data: UpdateContactTypeDTO){
        await this.checkConctactTypeDoesntExist(data.type);
        return await this.prisma.contact_Types.update({
            where: {type: data.type},
            data
        });
    }

    async deleteContactType(type: string){
        await this.checkConctactTypeDoesntExist(type);
        return await this.prisma.contact_Types.delete({
            where: {type}
        });
    }

    //if contact type doesn't exist a bad request exception error will be thrown
    async checkConctactTypeDoesntExist(type: string){
        const contact = await this.prisma.contact_Types.findFirst({where: {type}});
        if(!contact) throw new BadRequestException("Contact does not exist");
    }
}
