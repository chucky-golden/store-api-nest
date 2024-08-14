import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose'


@Schema({ timestamps: true })

export class Order extends Document{ 

    @Prop()
    userId: string

    @Prop()
    orderId: string

    @Prop()
    name: string

    @Prop()
    email: string

    @Prop()
    phone: string

    @Prop()
    country: string
    
    @Prop()
    city: string
    
    @Prop()
    lga: string
    
    @Prop()
    landmark: string
    
    @Prop()
    additionalNote: string

    @Prop()
    amount: string

    @Prop({ default: 'Placed' })
    status: string
    
    @Prop()
    item: string

    @Prop()
    itemTotal: string
    
    @Prop({ default: false })
    paid: boolean
}


@Schema({ timestamps: true })
export class SaveAddress extends Document{ 

    @Prop()
    userId: string
    
    @Prop()
    country: string
    
    @Prop()
    city: string
    
    @Prop()
    lga: string
    
    @Prop()
    landmark: string
    
    @Prop()
    additionalNote: string
}

export const OrderSchema = SchemaFactory.createForClass(Order)
export const SaveAddressSchema = SchemaFactory.createForClass(SaveAddress)