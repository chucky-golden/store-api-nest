import { IsArray, IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


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

    @IsOptional()
    readonly sku: string;

    @IsNotEmpty()
    @IsNumber()
    readonly quantity: number;

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
    readonly specifications: string[];

    @IsOptional()
    @IsArray()
    readonly colors: string[];

    @IsNotEmpty()
    @IsArray()
    readonly features: string[];

    @IsNotEmpty()
    @IsArray()
    readonly tags: string[];

    @IsOptional()
    @IsBoolean()
    readonly swap: boolean;
}