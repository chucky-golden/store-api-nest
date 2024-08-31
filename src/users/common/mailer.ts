import dotenv from 'dotenv';
dotenv.config();
import * as nodemailer from 'nodemailer';
import Mailgen = require('mailgen');

const HOST: any = process.env.EMAIL_HOST
const PORT: any = process.env.EMAIL_PORT
const USER: any = process.env.EMAIL_USER
const PASS: any = process.env.EMAIL_PASS

// Configure mailgen by setting a theme and your product info
export const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        // Appears in header & footer of e-mails
        name: 'Churchil',
        link: 'https://www.Churchilexpansions.com/'
    }
});


// mail request
export const sendmail = (to: string, subject: string, message: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        // email configuration 
        const transporter = nodemailer.createTransport({
            host: HOST,
            port: PORT,
            secure: true,
            auth: {
            user: USER,
            pass: PASS
            }
        });

        const mailOptions = {
            from: USER,
            to: to,
            subject: subject,
            html: message
        };

        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.error('Error sending email:', error);
            reject(error);
        } else {
            console.log('Email sent:', info.response);
            resolve(true);
        }
        });
    });

}