import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../auth/auth.service';
import { SignupDto, SigninDto } from './dto/user.dto';
import { generateOtp } from './common/generate';
import { mailGenerator, sendmail } from './common/mailer';
import { Contact } from './schema/contact.schema';

@Injectable()
export class UsersService {
    constructor(
        // bringing in the user model
        @InjectModel(User.name)
        private userModel: Model<User>,
        
        // bringing in the user model
        @InjectModel(Contact.name)
        private contactModel: Model<Contact>,

        // bringing in jwt to generate tokens
        private authService: AuthService,
    ){}

    // user register
    async signUp(signUpDto: SignupDto) {
        try {
            const { password } = signUpDto

            const check = await this.userModel.findOne({ email: signUpDto.email })

            if(check){
                throw new UnauthorizedException('email already exists')
            }

            const hashedPassword = await bcrypt.hash(password, 10)  
            
            signUpDto.password = hashedPassword

            const user = await this.userModel.create(signUpDto)

            let num: string = generateOtp()
            var emailSender: any = {
                body: {
                    name: signUpDto.name,
                    intro: 'We got a request to verify your mail. Please enter OTP on next page to complete verification and access account. If this was you, enter the otp in the next page or ignore and nothing will happen to your account.\n',

                    action: {
                        instructions: 'To get started, enter the OTP in the app window',
                        button: {
                            color: '#ffffff',
                            text: `<span style="font-size: 30px; font-weight: bolder; color: black">${num}</span>`,
                            link: ''
                        }
                    },
                    
                    outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.\n\n Team Churchil.'
                }
            };

            let emailBody: any = mailGenerator.generate(emailSender);

            await sendmail(signUpDto.email, 'Email Verification', emailBody)

            user.password = ''
            const token = await this.authService.generateToken({ id: user._id, type: 'user' })

            return { message: 'successful', user, token, otp: num }

        } catch (error: any) {
            if (error instanceof UnauthorizedException && error.message === 'email already exist') {
                throw error;
            } else {
                console.log('signing up ' + error);            
                throw new InternalServerErrorException(`user cannot be created now`);
            }
        }
    }

    // user thirdparty register
    async thirdPartySignup(signUpDto: any) {
        try {
            const { password } = signUpDto

            const check = await this.userModel.findOne({ email: signUpDto.email })

            if(check){
                check.password = ''
                const token = await this.authService.generateToken({ id: check._id, type: 'user' })

                return { message: 'successful', check, token }
            }

            const user = await this.userModel.create(signUpDto)

            await this.userModel.updateOne({ email: signUpDto.email }, 
                {
                    $set:{
                        emailVerified: true
                    }
                }
            )

            const token = await this.authService.generateToken({ id: user._id, type: 'user' })

            return { message: 'successful', user, token }

        } catch (error: any) {
            console.log('signing up ' + error);            
            throw new InternalServerErrorException(`user cannot be created now`);
        }
    }

    // user thirdparty login
    async thirdPartyLogin(signInDto: any) {
        try {

            const check = await this.userModel.findOne({ email: signInDto.email })

            if(!check){
                throw new InternalServerErrorException(`user user with specified email not found`);
            }

            if(check.active !== 1){
                throw new UnauthorizedException('account has been blocked')
            }

            check.password = ''
            const token = await this.authService.generateToken({ id: check._id, type: 'user' })

            return { message: 'successful', check, token }

        } catch (error: any) {
            console.log('signing up ' + error);            
            throw new InternalServerErrorException(`user cannot be created now`);
        }
    }

    // user login
    async login(loginDto: SigninDto): Promise<{ message: string, user: any, token: string }>{
        try{
            const { email, password } = loginDto

            const user = await this.userModel.findOne({ email: email })

            if(!user){
                throw new UnauthorizedException('invalid email or password')
            }

            if(user.active !== 1){
                throw new UnauthorizedException('account has been blocked')
            }

            if(user.emailVerified === false){
                throw new UnauthorizedException('email not verified')
            }

            const isPasswordMatched = await bcrypt.compare(password, user.password)

            if(!isPasswordMatched){
                throw new UnauthorizedException('invalid email or password')
            }

            user.password = ''
            const token = await this.authService.generateToken({ id: user._id, type: 'user' })

            return { message: 'successful', user, token }

        }catch(error: any){
            if (error instanceof UnauthorizedException) {
                throw error;
            } else {
                console.log('signing up ' + error);            
                throw new InternalServerErrorException(`admin cannot be created now`);
            }
        }
        
    }

    // user forgot password
    async forgotPassword(body: { email: string }) {
        const { email } = body

        const user = await this.userModel.findOne({ email })

        if(!user){
            throw new NotFoundException('email does not exist')
        }

        let num: string = generateOtp()
        var emailSender: any = {
            body: {
                name: 'User',
                intro: 'We got a request to reset your password, if this was you, enter the otp in the next page to reset password or ignore and nothing will happen to your account',

                action: {
                    instructions: 'To get started, enter the OTP in the app window',
                    button: {
                        color: '#ffffff',
                        text: `<span style="font-size: 30px; font-weight: bolder; color: black">${num}</span>`,
                        link: ''
                    }
                },
                
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.\n\n Team Kraftkollectors.'
            }
        };

        let emailBody: any = mailGenerator.generate(emailSender);
        // send mail
        const sent = await sendmail(email, 'Password Recovery', emailBody);
        if(sent === true){
            return { message: 'email sent', email}
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
                    password: hashedPassword
                }
            },
            { 
                new: true, 
                runValidators: true 
            }
        )

        if(user !== null){
            return { message: "success", email }
        }else{
            return { message: "error", email }
        }
    }

    // user verify email address
    async verifyEmail(body: { email: string }) {
        const { email } = body

        const user:any  = await this.userModel.findOneAndUpdate({ email }, 
            {
                $set:{
                    emailVerified: true
                }
                
            },
            { 
                new: true, 
                runValidators: true 
            }
        )

        if(user !== null){
            return { message: "success", user }
        }else{
            return { message: "error", user }
        }
    }

    // user verify email address
    async otpAgain(body: { email: string }) {
        const { email } = body

        let num: string = generateOtp()
            var emailSender: any = {
                body: {
                    name: 'User',
                    intro: 'We got a request for an OTP to complete request. Please enter the OTP on next page to complete verification and access account. If this was you, enter the otp in the next page or ignore and nothing will happen to your account.\n',

                    action: {
                        instructions: 'To get started, enter the OTP in the app window',
                        button: {
                            color: '#ffffff',
                            text: `<span style="font-size: 30px; font-weight: bolder; color: black">${num}</span>`,
                            link: ''
                        }
                    },
                    
                    outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.\n\n Team Churchil.'
                }
            };

        let emailBody: any = mailGenerator.generate(emailSender);

        await sendmail(email, 'OTP Mail', emailBody)

        return { message: "success", email, otp: num }
    }
    
    // user verify email address
    async contact(body: any) {
        const user = await this.contactModel.create(body)

        if(user !== null){
            return { message: "success", user }
        }else{
            return { message: "error", user }
        }
    }
}

