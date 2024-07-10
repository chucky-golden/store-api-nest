import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";


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
    readonly regularPrice: string;

    @IsNotEmpty()
    @IsString()
    readonly salePrice: string;

    @IsNotEmpty()
    @IsString()
    readonly sku: string;

    @IsNotEmpty()
    @IsNumber()
    readonly quantity: string;

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
    readonly specifications: [];

    @IsNotEmpty()
    @IsArray()
    readonly features: [];

    @IsNotEmpty()
    @IsArray()
    readonly tags: [];
}