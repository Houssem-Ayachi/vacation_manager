import { IsString } from "class-validator"

export class CreateStatusDTO{
    @IsString()
    label: string
}