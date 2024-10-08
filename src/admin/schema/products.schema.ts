import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose'


@Schema({ timestamps: true })
export class Category extends Document{ 

    @Prop({ unique: [true, 'Duplicate category entered'] })
    name: string
    
    @Prop()
    image: string

    @Prop()
    brands: []
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
    price: number

    @Prop({ required: false })
    sku: string

    @Prop()
    quantity: number

    @Prop()
    category: string

    @Prop()
    brand: string

    @Prop()
    description: string

    @Prop({ required: false })
    slug: string

    @Prop({ required: false })
    colors: []

    @Prop()
    specifications: []

    @Prop()
    features: []

    @Prop()
    tags: []

    @Prop()
    uploadUrl: []

    @Prop({ required: false, default: 0 })
    sellingCount: number
}

@Schema({ timestamps: true })
export class Review extends Document{ 

    @Prop()
    productId: string

    @Prop()
    userId: string

    @Prop()
    review: string

    @Prop({ required: false })
    rating: number

    @Prop({ required: false, default: false })
    draft: boolean
}

@Schema({ timestamps: true })
export class Rating extends Document{ 

    @Prop()
    productId: string
    
    @Prop()
    userId: string

    @Prop()
    rating: number
}

@Schema({ timestamps: true })
export class Flyer extends Document{ 

    @Prop()
    section: string
    
    @Prop()
    img: string
}


export const ProductSchema = SchemaFactory.createForClass(Product)
export const ReviewSchema = SchemaFactory.createForClass(Review)
export const RatingSchema = SchemaFactory.createForClass(Rating)
export const CategorySchema = SchemaFactory.createForClass(Category)
export const BrandSchema = SchemaFactory.createForClass(Brand)
export const FlyerSchema = SchemaFactory.createForClass(Flyer)

ProductSchema.set('toObject', { virtuals: true });
ProductSchema.set('toJSON', { virtuals: true });
ReviewSchema.set('toObject', { virtuals: true });
ReviewSchema.set('toJSON', { virtuals: true });