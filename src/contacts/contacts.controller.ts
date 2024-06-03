import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDTO, UpdateContactDTO } from './contacts.dto';
import { JwtGuard } from 'src/guards/jwtguard/jwtguard.guard';

@UseGuards(JwtGuard)
@Controller('contacts')
export class ContactsController {

    constructor(private readonly contactsService: ContactsService){}

    @Get("/:employee_id")
    async getEmployeeContacts(@Param('employee_id', ParseIntPipe) employee_id: number){
        return await this.contactsService.getEmployeeContacts(employee_id);
    }
    
    @Post("/")
    async createContact(@Body() body: CreateContactDTO, @Req() req: any){
        return await this.contactsService.createContact(body, req.employee.id);
    }

    @Put("/")
    async updateContact(@Body() body: UpdateContactDTO, @Req() req: any){
        return await this.contactsService.updateContact(body, req.employee.id);
    }

    @Delete("/:id")
    async deleteContact(@Param("id", ParseIntPipe) id: number, @Req() req: any){
        return await this.contactsService.deleteContact(id, req.employee.id);
    }

}
