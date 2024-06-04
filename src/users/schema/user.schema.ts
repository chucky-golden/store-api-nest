import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose'


@Schema({ timestamps: true })

export class User extends Document{ 

    @Prop()
    name: string

    @Prop()
    readonly email: string

    @Prop()
    phone: string

    @Prop()
    password: string

    @Prop({ required: false })
    address: string

    @Prop({ required: false })
    country: string

    @Prop({ required: false })
    state: string
    
    @Prop({ default: 1 })
    active: Number
    
    @Prop({ default: false })
    emailVerified: boolean
}

export const UserSchema = SchemaFactory.createForClass(User)