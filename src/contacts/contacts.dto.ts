import { IsString, IsInt } from "class-validator";

export class CreateContactDTO{
    @IsString()
    value: string
    @IsString()
    contact_type_id: string
}

export class UpdateContactDTO{
    @IsInt()
    id: number
    @IsString()
    value: string
    @IsString()
    contact_type_id: string
}