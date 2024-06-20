import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class SignupDto {
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'please enter correct email' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    readonly address: string;

    @IsOptional()
    @IsString()
    readonly country: string;

    @IsOptional()
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


export class CreateReview {

    @IsNotEmpty()
    @IsString()
    readonly productId: string;

    @IsNotEmpty()
    @IsNumber()
    readonly rating: number;

    @IsNotEmpty()
    @IsString()
    readonly review: string;
}


export class CreateOrderDto {

    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'please enter correct email' })
    readonly email: string;

    @IsNotEmpty()
    @IsString()
    readonly phone: string;

    @IsNotEmpty()
    @IsString()
    readonly address: string;

    @IsNotEmpty()
    @IsString()
    readonly amount: string;

    @IsNotEmpty()
    @IsString()
    readonly item: string;

    @IsNotEmpty()
    @IsString()
    readonly itemTotal: string;
}