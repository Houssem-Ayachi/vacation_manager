import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateContactDTO, UpdateContactDTO } from './contacts.dto';
import { ContactsTypesService } from 'src/contacts_types/contacts_types.service';

@Injectable()
export class ContactsService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly contactTypesService: ContactsTypesService
        ){}

    
    async getEmployeeContacts(employee_id: number){
        return await this.prisma.contacts.findMany({where: {employee_id}, include: {contacts_types: true}});
    }

    async createContact(data: CreateContactDTO, employeeID: number){
        //checking if employee didn't send a valid contact_type id
        await this.contactTypesService.checkConctactTypeDoesntExist(data.contact_type_id);
        return await this.prisma.contacts.create({
            data: {
                ...data,
                employee_id: employeeID
            }
        });
    }

    async updateContact(data: UpdateContactDTO, employee_id: number){
        await this.checkContactExists(data.id, employee_id);
        await this.contactTypesService.checkConctactTypeDoesntExist(data.contact_type_id);
        return await this.prisma.contacts.update({
            where: {id: data.id, employee_id: employee_id},
            data
        });
    }

    async deleteContact(id: number, employee_id: number){
        await this.checkContactExists(id, employee_id);
        return await this.prisma.contacts.delete({
            where: {id}
        });
    }

    private async checkContactExists(id: number, employee_id: number){
        const contact = await this.prisma.contacts.findFirst({where: {id}});
        if(!contact){
            throw new BadRequestException("not found");
        }
        if(contact.employee_id !== employee_id){
            throw new UnauthorizedException();
        }
    }
}
