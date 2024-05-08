import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schema/admin.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignupDto, SigninDto } from './dto/admin.dto';
import { SendMailService } from 'src/mailer';

@Injectable()
export class AdminService {
    constructor(
        // bringing in the admin model
        @InjectModel(Admin.name)
        private adminModel: Model<Admin>,

        // bringing in jwt to generate tokens
        private jwtService: JwtService,

        // send mail service
        private readonly sendMailService: SendMailService
    ){}

    // admin register
    async signUp(signUpDto: SignupDto): Promise<{ message: string, admin: any, token: string }> {
        try{
            const { email, password } = signUpDto

            const check = await this.adminModel.findOne({ email: email })
            if(check){
                throw new UnauthorizedException('email already exist')
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            
            signUpDto.password = hashedPassword

            const admin = await this.adminModel.create(signUpDto)

            admin.password = ''
            const token = this.jwtService.sign({ id: admin._id, type: 'admin' })

            return { message: 'successful', admin, token }

        } catch (error: any) {
            if (error instanceof UnauthorizedException && error.message === 'email already exist') {
                throw error;
            } else {
                console.log('signing up ' + error);            
                throw new InternalServerErrorException(`admin cannot be created now`);
            }
        }
    }

    // admin login
    async login(loginDto: SigninDto): Promise<{ message: string, admin: any, token: string }> {
        
        const { email, password } = loginDto

        const admin = await this.adminModel.findOne({ email: email })

        if(!admin){
            throw new UnauthorizedException('email does not exist')
        }

        const isPasswordMatched = await bcrypt.compare(password, admin.password)

        if(!isPasswordMatched){
            throw new UnauthorizedException('invalid email or password')
        }

        admin.password = ''
        const token = this.jwtService.sign({ id: admin._id, type: 'admin' })

        return { message: 'successful', admin, token }
    }


    // admin forgot password
    async forgotPassword(body: { email: string }) {
        const { email } = body

        const admin = await this.adminModel.findOne({ email })

        if(!admin){
            throw new NotFoundException('email does not exist')
        }

        let send = await this.sendMailService.sendMail(email, 'Password Recovery')
        if(send === true){
            return { message: 'successful', email}
        }else{
            throw new BadRequestException('error sending mail')
        }
    }

    // admin reset password
    async passwordReset(body: { email: string, password: string }) {
        const { email, password } = body
        const hashedPassword = await bcrypt.hash(password, 10);

        const admin:any  = await this.adminModel.updateOne({ email }, 
            {
                $set:{
                    password:hashedPassword
                }
            }
        )

        if(admin !== null){
            return { message: "success", email }
        }else{
            return { message: "error", email }
        }
    }
}
