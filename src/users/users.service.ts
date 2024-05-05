import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignupDto, SigninDto } from './dto/user.dto';
import { SendMailService } from '../mailer';

@Injectable()
export class UsersService {
    constructor(
        // bringing in the user model
        @InjectModel(User.name)
        private userModel: Model<User>,

        // bringing in jwt to generate tokens
        private jwtService: JwtService,

        // send mail service
        private readonly sendMailService: SendMailService
    ){}

    // user register
    async signUp(signUpDto: SignupDto): Promise<{ user: any, token: string }> {
        try {
            const { password } = signUpDto

            const hashedPassword = await bcrypt.hash(password, 10)  
            
            signUpDto.password = hashedPassword

            const user = await this.userModel.create(signUpDto)

            user.password = ''
            const token = this.jwtService.sign({ id:user._id })

            return { user, token }

        } catch (error: any) {
            console.log('signing up ' + error);            
            throw new InternalServerErrorException(`user cannot be created now`);
        }
    }

    // user login
    async login(loginDto: SigninDto): Promise<{ user: any, token: string }>{
        
        const { email, password } = loginDto

        const user = await this.userModel.findOne({ email: email })

        if(!user){
            throw new UnauthorizedException('invalid email or password')
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password)

        if(!isPasswordMatched){
            throw new UnauthorizedException('invalid email or password')
        }

        user.password = ''
        const token = this.jwtService.sign({ id:user._id })

        return { user, token } 
    }

    // user forgot password
    async forgotPassword(body: { email: string }) {
        const { email } = body

        const user = await this.userModel.findOne({ email })

        if(!user){
            throw new NotFoundException('email does not exist')
        }

        let send = await this.sendMailService.sendMail(email, 'Password Recovery')
        if(send === true){
            return email
        }else{
            throw new BadRequestException('error sending mail')
        }
    }

    // user reset password
    async passwordReset(body: { email: string, password: string }) {
        const { email, password } = body
        const hashedPassword = await bcrypt.hash(password, 10);

        const user:any  = await this.userModel.updateOne({ email }, 
            {
                $set:{
                    password:hashedPassword
                }
            }
        )

        if(user !== null){
            return { message: "success", email }
        }else{
            return { message: "error", email }
        }
    }
}

