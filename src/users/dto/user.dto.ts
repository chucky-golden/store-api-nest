import { IsEmail, IsEmpty, IsNotEmpty, IsOptional, IsString } from "class-validator";


export class SignupDto {

    @IsNotEmpty()
    @IsString()
    readonly fname: string;

    @IsNotEmpty()
    @IsString()
    readonly lname: string;

    @IsOptional()
    readonly mname?: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'please enter correct email' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    readonly address: string;

    @IsNotEmpty()
    @IsString()
    readonly country: string;

    @IsNotEmpty()
    @IsString()
    readonly state: string;
}


export class SigninDto {

    @IsNotEmpty()
    @IsEmail({}, { message: 'please enter correct email' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;
}