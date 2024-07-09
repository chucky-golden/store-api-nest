import { IsArray, IsEmail, IsNotEmpty, IsString } from "class-validator";


export class SignupDto {

    @IsNotEmpty()
    @IsEmail({}, { message: 'please enter correct email' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}


export class SigninDto {

    @IsNotEmpty()
    @IsEmail({}, { message: 'please enter correct email' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly password: string;
}


export class ProductDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly price: string;

    @IsNotEmpty()
    @IsString()
    readonly category: string;

    @IsNotEmpty()
    @IsString()
    readonly brand: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsArray()
    readonly specifications: string;

    @IsNotEmpty()
    @IsArray()
    readonly features: string;
}