import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from "../users/schema/user.schema";
import { Model } from "mongoose";
import { Admin } from "../admin/schema/admin.schema";
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,

        @InjectModel(Admin.name)
        private adminModel: Model<Admin>,

        private jwtService: JwtService
    ){}

    async validateUser(payload) {
        try {    
            const { id, type } = payload;
            
            if (type === 'user') {
                const user = await this.userModel.findById(id);
                if (!user) {
                    throw new UnauthorizedException('Login first to access this endpoint');
                }
                return user;
            } else if (type === 'admin') {
                const admin = await this.adminModel.findById(id);
                if (!admin) {
                    throw new UnauthorizedException('Login first to access this endpoint');
                }
                return admin;
            }
        } catch (error) {
            console.error('Error validating user:', error);
            throw new UnauthorizedException('Invalid token');
        }
    }

    async generateToken(user: any) {
        // Generate JWT token
        const payload = { id: user.id, type: user.type };
        const accessToken = this.jwtService.sign(
            payload, 
            { secret: process.env.JWT_SECRET, expiresIn: process.env.JWT_EXPIRE }
        );

        return accessToken
    }

}
