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



@Schema({ timestamps: true })

export class Swapped extends Document{ 

    @Prop()
    phoneType: string;

    @Prop()
    deviceModel: string;

    @Prop()
    deviceStorage: string;

    @Prop()
    receiveModel: string;

    @Prop()
    receiveStorage: string;

    @Prop()
    fullName: string;

    @Prop()
    email: string;

    @Prop()
    phone: string;

    @Prop()
    camera: string;
    
    @Prop()
    battery: string;

    @Prop()
    condition: string;

    @Prop()
    screenCondition: string;

    @Prop()
    microphone: string;

    @Prop()
    speaker: string;

    @Prop()
    repaired: string;

    @Prop()
    repairedPart: string;

    @Prop()
    warranty: string;

    @Prop()
    insurred: string;

    @Prop({ required: false })
    addittionalInfo: string;

    @Prop()
    picFront: string;

    @Prop()
    picBack: string;
    
    @Prop({ default: 'Pending', required: false })
    status: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order)
export const SaveAddressSchema = SchemaFactory.createForClass(SaveAddress)
export const CartSchema = SchemaFactory.createForClass(Cart)
export const SwapSchema = SchemaFactory.createForClass(Swapped)