import { IsDateString, IsInt, IsString } from "class-validator"

export class LeaveRequestData{
    id: number;
    start_date: Date;
    end_date: Date;
    response_date: Date;
    employee_comment: string;
    admin_comment: string;
    created_at: Date;
    updated_at: Date;
    employee_id: number;
    admin_id: number;
    leave_status_id: string;
    leave_type_id: string;
}

export class CreateLeaveRequestDTO{
    @IsDateString()
    start_date: string

    @IsDateString()
    end_date: string

    @IsString()
    employee_comment: string

    @IsString()
    leave_type_id: string
}

export class UpdateLeaveRequestDTO{
    @IsInt()
    id: number

    @IsDateString()
    start_date: string

    @IsDateString()
    end_date: string

    @IsString()
    employee_comment: string

    @IsString()
    leave_type_id: string

    @IsInt()
    employee_id: number
}

export class LeaveRequestReplyDTO{
    @IsInt()
    id: number

    @IsInt()
    employee_id: number

    @IsString()
    admin_comment: string

    @IsString()
    leave_status_id: string
}

export class MonthLeaveQueryDTO{
    @IsDateString()
    searchDate: Date
}