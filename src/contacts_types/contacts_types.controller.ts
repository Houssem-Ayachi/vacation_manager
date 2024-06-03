import { Controller, UseGuards, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { IsAdminGuard } from 'src/guards/is-admin/is-admin.guard';
import { JwtGuard } from 'src/guards/jwtguard/jwtguard.guard';
import { ContactsTypesService } from './contacts_types.service';
import { CreateContactTypeDTO, UpdateContactTypeDTO } from './contacts_types.dto';

@UseGuards(JwtGuard)
@Controller('contacts-types')
export class ContactsTypesController {

    constructor(private readonly contactsTypesService: ContactsTypesService){}

    @Get("/")
    async getContactsTypes(){
        return await this.contactsTypesService.getContactTypes();
    }

    @UseGuards(IsAdminGuard)
    @Post("/")
    async createContactType(@Body() body: CreateContactTypeDTO){
        return await this.contactsTypesService.createContactType(body);
    }

    @UseGuards(IsAdminGuard)
    @Put("/")
    async updateContactType(@Body() body: UpdateContactTypeDTO){
        return await this.contactsTypesService.updateContactType(body);
    }

    @UseGuards(IsAdminGuard)
    @Delete("/:id")
    async deleteContactType(@Param("id") id: string){
        return await this.contactsTypesService.deleteContactType(id)
    }
}
