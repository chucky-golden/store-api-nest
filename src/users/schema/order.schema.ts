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
    address: string
    
    @Prop()
    lga: string
    
    @Prop()
    state: string
    
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
    phone: string
    
    @Prop()
    country: string
    
    @Prop()
    city: string
    
    @Prop()
    address: string
    
    @Prop()
    lga: string
    
    @Prop()
    state: string
    
    @Prop()
    landmark: string
    
    @Prop()
    additionalNote: string
}

@Schema({ timestamps: true })
export class Cart extends Document{ 

    @Prop()
    userId: string

    @Prop()
    cartData: string
}

export const OrderSchema = SchemaFactory.createForClass(Order)
export const SaveAddressSchema = SchemaFactory.createForClass(SaveAddress)
export const CartSchema = SchemaFactory.createForClass(Cart)