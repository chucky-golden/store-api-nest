import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, Brand, Product } from './schema/products.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
    constructor(
        // bringing in models
        @InjectModel(Category.name)
        private categoryModel: Model<Category>,

        @InjectModel(Brand.name)
        private brandModel: Model<Brand>,

        @InjectModel(Product.name)
        private productModel: Model<Product>,
    ){}


    // add category
    async addCategory(categoryDto: { name: string }) {
        try{            
            const category = await this.categoryModel.create(categoryDto)

            return { message: "category added", category }

        } catch (error: any) {
            console.log('category error ' + error);            
            throw new InternalServerErrorException(`category cannot be created now`);
        }
    }

    // add brand
    async addBrand(brandDto: { name: string }) {
        
        try{
            const brand = await this.brandModel.create(brandDto)

            return { message: "brand added", brand }

        } catch (error: any) {
            console.log('brand error ' + error);            
            throw new InternalServerErrorException(`brand cannot be created now`);
        }
    }

    // add product
    async addProduct(productDto: any) {
        
        try{
            const product = await this.productModel.create(productDto)

            return { message: "product added", product }

        } catch (error: any) {
            console.log('product error ' + error);            
            throw new InternalServerErrorException(`product cannot be created now`);
        }
    }

    // admin login
    async getAll(data: string ) {
        let fetchData = []

        if(data === 'category'){
            fetchData = await this.categoryModel.find().sort({ createdAt: -1 })

        }else if(data === 'brand'){
            fetchData = await this.brandModel.find().sort({ createdAt: -1 })

        }else if(data === 'product'){
            fetchData = await this.productModel.find().sort({ createdAt: -1 })

        }else{
            throw new NotFoundException('invalid data')
        }

        return fetchData
    }

}
