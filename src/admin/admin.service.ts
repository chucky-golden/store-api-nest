import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schema/admin.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { SignupDto, SigninDto } from './dto/admin.dto';
import { UploadService } from './common/cloudinary';
import { SendMailService } from 'src/mailer';

@Injectable()
export class AdminService {
    constructor(
        // bringing in the admin model
        @InjectModel(Admin.name)
        private adminModel: Model<Admin>,

        // bringing in jwt to generate tokens
        private jwtService: JwtService,

        // image upload service
        private readonly uploadService: UploadService,

        // send mail service
        private readonly sendMailService: SendMailService
    ){}

    // admin register
    async signUp(signUpDto: SignupDto): Promise<{ admin: any, token: string }> {
        try{
            const { email, password } = signUpDto

            const hashedPassword = await bcrypt.hash(password, 10)
            
            signUpDto.password = hashedPassword

            const admin = await this.adminModel.create(signUpDto)

            admin.password = ''
            const token = this.jwtService.sign({ id:admin._id })

            return { admin, token }

        } catch (error: any) {
            console.log('signing up ' + error);            
            throw new InternalServerErrorException(`admin cannot be created now`);
        }
    }

    // admin login
    async login(loginDto: SigninDto): Promise<{ admin: any, token: string }> {
        
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
        const token = this.jwtService.sign({ id:admin._id })

        return { admin, token }
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
            return email
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
