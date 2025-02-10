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

    @IsNotEmpty({ message: 'enter valid product name' })
    @IsString()
    readonly name: string;

    @IsNotEmpty({ message: 'enter valid price' })
    @IsString()
    readonly price: string;

    @IsOptional()
    readonly sku: string;

    @IsNotEmpty({ message: 'enter valid quantity' })
    @IsNumber()
    readonly quantity: number;

    @IsNotEmpty({ message: 'enter valid category' })
    @IsString()
    readonly category: string;

    @IsNotEmpty({ message: 'enter valid brand' })
    @IsString()
    readonly brand: string;

    @IsNotEmpty({ message: 'enter valid description' })
    @IsString()
    readonly description: string;

    @IsNotEmpty({ message: 'enter valid specifications' })
    @IsArray()
    readonly specifications: string[];

    @IsOptional()
    @IsArray()
    readonly colors: string[];

    @IsNotEmpty({ message: 'enter valid features' })
    @IsArray()
    readonly features: string[];

    @IsNotEmpty({ message: 'enter valid tags' })
    @IsArray()
    readonly tags: string[];

    @IsOptional()
    @IsBoolean()
    readonly swap: boolean;
}