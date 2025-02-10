import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class SignupDto {
    @IsNotEmpty({ message: 'enter valid name' })
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'please enter correct email' })
    readonly email: string;

    @IsNotEmpty({ message: 'enter valid phone number' })
    @IsString()
    readonly phone: string;

    @IsNotEmpty({ message: 'enter valid password' })
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

    @IsNotEmpty({ message: 'enter valid password' })
    @IsString()
    readonly password: string;
}


export class CreateReview {

    @IsNotEmpty()
    @IsString()
    readonly productId: string;

    @IsNotEmpty()
    @IsString()
    readonly userId: string;

    @IsNotEmpty({ message: 'enter valid review' })
    @IsString()
    readonly review: string;

    @IsOptional()
    @IsNumber()
    readonly rating: number;
}


export class CreateRating {

    @IsNotEmpty()
    @IsString()
    readonly productId: string;
    
    @IsNotEmpty()
    @IsString()
    readonly userId: string;

    @IsNotEmpty()
    @IsNumber()
    readonly rating: number;
}


export class CreateOrderDto {

    @IsOptional()
    @IsString()
    readonly userId: string;

    @IsNotEmpty({ message: 'enter valid name' })
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'please enter correct email' })
    readonly email: string;

    @IsNotEmpty({ message: 'enter valid phone number' })
    @IsString()
    readonly phone: string;

    @IsNotEmpty({ message: 'enter valid country' })
    @IsString()
    readonly country: string;

    @IsNotEmpty({ message: 'enter valid city' })
    @IsString()
    readonly city: string;

    @IsNotEmpty({ message: 'enter valid address' })
    @IsString()
    readonly address: string;

    @IsNotEmpty({ message: 'enter valid local government area' })
    @IsString()
    readonly lga: string;

    @IsNotEmpty({ message: 'enter valid state' })
    @IsString()
    readonly state: string;

    @IsOptional()
    @IsString()
    readonly landmark: string;
    
    @IsOptional()
    @IsString()
    readonly additionalNote: string;

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

export class CreateSwapDto {

    @IsNotEmpty({ message: 'enter valid phone number' })
    @IsString()
    readonly phoneType: string;

    @IsNotEmpty({ message: 'enter valid device model' })
    @IsString()
    readonly deviceModel: string;

    @IsNotEmpty({ message: 'enter valid device storage' })
    @IsString()
    readonly deviceStorage: string;

    @IsNotEmpty({ message: 'enter valid device model you want to receive' })
    @IsString()
    readonly receiveModel: string;

    @IsNotEmpty({ message: 'enter valid device storage you want to receive' })
    @IsString()
    readonly receiveStorage: string;

    @IsNotEmpty({ message: 'enter valid fullname' })
    @IsString()
    readonly fullName: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'please enter correct email' })
    readonly email: string;

    @IsNotEmpty({ message: 'enter valid phone number' })
    @IsString()
    readonly phone: string;

    @IsOptional({ message: 'enter valid camera quality' })
    @IsString()
    readonly camera: string;
    
    @IsOptional({ message: 'enter valid battery quality' })
    @IsString()
    readonly battery: string;

    @IsNotEmpty({ message: 'enter valid phone condition' })
    @IsString()
    readonly condition: string;

    @IsNotEmpty({ message: 'enter valid screen condition' })
    @IsString()
    readonly screenCondition: string;

    @IsNotEmpty({ message: 'enter valid microphone condition' })
    @IsString()
    readonly microphone: string;

    @IsNotEmpty({ message: 'enter valid speaker condition' })
    @IsString()
    readonly speaker: string;

    @IsNotEmpty({ message: 'has your phone being repaired' })
    @IsString()
    readonly repaired: string;

    @IsNotEmpty({ message: 'enter valid repaired part' })
    @IsString()
    readonly repairedPart: string;

    @IsNotEmpty({ message: 'enter valid warranty' })
    @IsString()
    readonly warranty: string;

    @IsNotEmpty({ message: 'enter valid insurred answer' })
    @IsString()
    readonly insurred: string;

    @IsOptional()
    @IsString()
    readonly addittionalInfo: string;

    @IsNotEmpty()
    @IsString()
    readonly picFront: string;

    @IsNotEmpty()
    @IsString()
    readonly picBack: string;
}