import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { User } from "../users/schema/user.schema";
import { Model } from "mongoose";
import { Admin } from "../admin/schema/admin.schema";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,

        @InjectModel(Admin.name)
        private adminModel: Model<Admin>
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload){
        const { id, type } = payload 
        
        if(type === 'user'){
            const user = await this.userModel.findById(id)
            if(!user){
                throw new UnauthorizedException('Login first to access this endpoint')
            }
            return user

        }else if(type === 'admin'){
            const user = await this.adminModel.findById(id)
            if(!user){
                throw new UnauthorizedException('Login first to access this endpoint')
            }
            return user

        }

    }
}