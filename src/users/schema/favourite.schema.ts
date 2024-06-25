import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose'


@Schema({ timestamps: true })

export class Favourite extends Document{ 

    @Prop()
    productId: string

    @Prop()
    userId: string
}

export const FavouriteSchema = SchemaFactory.createForClass(Favourite)