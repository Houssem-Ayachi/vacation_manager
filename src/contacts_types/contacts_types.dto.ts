import { IsString } from "class-validator";

//TODO: dunno if these help verify the value client-side or back-end-side or both
export enum ValueTypes {
    STRING = "string",
    NUMBER = "number"
}

export class CreateContactTypeDTO{
    @IsString()
    type: string
    @IsString()
    value_type: string
}

export class UpdateContactTypeDTO{
    @IsString()
    type: string
}