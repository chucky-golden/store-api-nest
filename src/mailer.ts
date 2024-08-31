import nodemailer from 'nodemailer';
import Mailgen  = require('mailgen')
import { Injectable } from '@nestjs/common';
import dotenv from 'dotenv';
dotenv.config();

const HOST: any = process.env.EMAIL_HOST
const PORT: any = process.env.EMAIL_PORT
const USER: any = process.env.EMAIL_USER
const PASS: any = process.env.EMAIL_PASS

@Injectable()
export class SendMailService {
    private transporter: any
    private mailGenerator: any

    constructor() {
        // Configure mailgen by setting a theme and your product info
        this.mailGenerator = new Mailgen({
            theme: 'default',
            product: {
                // Appears in header & footer of e-mails
                name: 'Churchil',
                link: 'https://www.Churchilexpansions.com/'
            }
        });

        // Configure nodemailer transporter
        this.transporter = nodemailer.createTransport({
            host: HOST,
            port: PORT,
            secure: true,
            auth: {
            user: USER,
            pass: PASS
            }
        });
    }

    generateOtp(){
        let num: string = ""
        for(let i = 0; i < 6; i++){ 
            num += Math.floor(Math.random() * (9 - 0 + 1)) + 0;
        }
        return num
    }

    async generateMail(email: string) {
        let num = this.generateOtp()
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
                
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.\n\n Team Churchil.'
            }
        };

        // Generate an HTML email with the provided contents
        return this.mailGenerator.generate(emailSender);
    }

    async sendMail(to: string, subject: string) {
        try {
            const message = await this.generateMail(to);
            const mailOptions = {
                from: USER,
                to: to,
                subject: subject,
                html: message
            };

            const info = await this.transporter.sendMail(mailOptions);
            return info.response.includes('OK'); // Assuming successful send if response includes 'OK'
        } catch (error) {
            console.error('Mail sending error:', error);
            return false;
        }
    }
}
