import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose'


@Schema({ timestamps: true })

export class User extends Document{ 

    @Prop()
    fname: string

    @Prop()
    lname: string

    @Prop({ required: false })
    mname?: string

    @Prop()
    readonly email: string

    @Prop()
    phone: string

    @Prop()
    password: string

    @Prop()
    address: string

    @Prop()
    country: string

    @Prop()
    state: string
    
    @Prop({ default: 1 })
    active: Number
}

export const UserSchema = SchemaFactory.createForClass(User)