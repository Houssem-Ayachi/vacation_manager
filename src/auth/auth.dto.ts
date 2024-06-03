import { IsEmail } from "class-validator"

export class SignInObj{
    @IsEmail()
    email: string
    password: string
}

export class ResetPasswordOBJ{
    code: number
    new_password: string
}