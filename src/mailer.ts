import nodemailer from 'nodemailer';
import Mailgen  = require('mailgen')
import { Injectable } from '@nestjs/common';

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
                link: 'https://www.churchil.com/'
            }
        });

        // Configure nodemailer transporter
        this.transporter = nodemailer.createTransport({
            host: 'mail.Churchil.com',
            port: 465,
            auth: {
                user: 'support@Churchil.com',
                pass: 'Churchil2024'
            }
        });
    }

    async generateMail(email: string) {
        const emailSender = {
            body: {
                name: 'Churchill Expansions',
                intro: 'We got a request to reset your password, if this was you, click the link below to reset password or ignore and nothing will happen to your account.',
                action: {
                    instructions: 'To get started, please click here:',
                    button: {
                        color: '#22BC66',
                        text: 'Recover Password',
                        link: 'https://www.churchillexpansions.com/passwordreset?email=' + email
                    }
                },
                outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.\n\n Team Hardware Mall.'
            }
        };

        // Generate an HTML email with the provided contents
        return this.mailGenerator.generate(emailSender);
    }

    async sendMail(to: string, subject: string) {
        try {
            const message = await this.generateMail(to);
            const mailOptions = {
                from: 'support@dooryd.com',
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
