import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose'


@Schema({ timestamps: true })
export class Category extends Document{ 

    @Prop({ unique: [true, 'Duplicate category entered'] })
    name: string
}


@Schema({ timestamps: true })
export class Brand extends Document{ 

    @Prop({ unique: [true, 'Duplicate brand entered'] })
    name: string
}


@Schema({ timestamps: true })
export class Product extends Document{ 

    @Prop()
    name: string

    @Prop()
    price: string

    @Prop()
    category: string

    @Prop()
    brand: string

    @Prop()
    description: string

    @Prop()
    uploadUrl: []
}

@Schema({ timestamps: true })
export class Review extends Document{ 

    @Prop()
    productId: string

    @Prop()
    rating: number

    @Prop()
    review: string
}


export const ProductSchema = SchemaFactory.createForClass(Product)
export const ReviewSchema = SchemaFactory.createForClass(Review)
export const CategorySchema = SchemaFactory.createForClass(Category)
export const BrandSchema = SchemaFactory.createForClass(Brand)