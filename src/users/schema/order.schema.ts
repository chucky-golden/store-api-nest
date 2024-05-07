import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose'


@Schema({ timestamps: true })

export class Order extends Document{ 

    @Prop()
    orderId: string

    @Prop()
    name: string

    @Prop()
    email: string

    @Prop()
    phone: string

    @Prop()
    address: string

    @Prop()
    amount: string

    @Prop({ default: 'Placed' })
    status: string
    
    @Prop()
    item: string

    @Prop()
    itemTotal: string
    
    @Prop({ default: 0 })
    paid: number
}

export const OrderSchema = SchemaFactory.createForClass(Order)