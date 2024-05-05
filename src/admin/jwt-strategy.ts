import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Admin } from "./schema/admin.schema";
import { Model } from "mongoose";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectModel(Admin.name)
        private adminModel: Model<Admin>
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
            secretOrKey: process.env.JWT_SECRET
        })
    }

    async validate(payload){
        const { id } = payload

        console.log(payload);
        

        const user = await this.adminModel.findById(id)

        if(!user){
            throw new UnauthorizedException('Login first to access this endpoint')
        }

        return user
    }
}