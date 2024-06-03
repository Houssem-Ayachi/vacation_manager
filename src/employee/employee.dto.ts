import { IsEmail, IsString, IsInt, IsDateString } from "class-validator";

export class CreateEmployeeDTO{
    @IsString()
    name: string;

    @IsString()
    last_name: string;

    @IsString()
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    phone_number: string;

    @IsInt()
    cnss: number

    @IsDateString()
    birth_date: Date

    @IsDateString()
    joined_date: Date

    @IsDateString()
    exit_date: Date
}

export type EmployeePublicData = {
    id: number;
    name: string;
    last_name: string;
    email: string;
    phone_number: string;
    birth_date: Date;
    joined_date: Date;
    exit_date: Date;
    admin_level: number;
    is_verified: boolean;
}

export class UpdateEmployeeDTO {
    id: number;
    name: string;
    last_name: string;
    email: string;
    phone_number: string;
}

export class EmployeeData {
    id: number;
    name: string;
    last_name: string;
    email: string;
    password: string;
    phone_number: string;
    cnss: number;
    paid_leaves: number
    birth_date: Date;
    joined_date: Date;
    exit_date: Date;
    admin_level: number;
    is_verified: boolean;
}

export enum AdminLevels {
    SUPER_ADMIN = 2,
    ADMIN = 1,
    EMPLOYEE = 0
}