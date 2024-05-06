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


    // add category / brand
    async addData(dataDto: { name: string, type: string }) {
        try{
            if(dataDto.type === 'brand'){
                const brand = await this.brandModel.create(dataDto)
                return { message: "brand added", brand }
            }else if(dataDto.type === 'category'){
                const category = await this.categoryModel.create(dataDto)
                return { message: "category added", category }
            }else{
                throw new BadRequestException('invalid entry')
            }

        } catch (error: any) {
            if (error instanceof BadRequestException && error.message === 'invalid entry') {
                throw error;
            } else {
                console.log('data error ' + error);            
                throw new InternalServerErrorException(`data cannot be created now`);
            }
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

    // get all product/brand/category
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

    // get single category/brand/product by id
    async getOne(id: string, type: string) {
        try{
            let fetchData = []
            if(type === 'category'){
                fetchData = await this.categoryModel.findOne({ _id: id })

            }else if(type === 'brand'){
                fetchData = await this.brandModel.findOne({ _id: id })

            }else if(type === 'product'){
                fetchData = await this.productModel.findOne({ _id: id })

            }else{
                throw new NotFoundException('id not found')
            }

            return fetchData
        } catch (error: any) {
            if (error instanceof NotFoundException && error.message === 'id not found') {
                throw error;
            } else {
                console.log('data error ' + error);            
                throw new InternalServerErrorException(`error processing request`);
            }
        }
    }


    // edit category / brand
    async editData(dataDto: { id: string, name: string, type: string }) {
        try{
            if(dataDto.type === 'brand'){
                await this.brandModel.updateOne({ _id: dataDto.id }, 
                    {
                        $set:{
                            name: dataDto.name
                        }
                    }
                )

            }else if(dataDto.type === 'category'){
                await this.categoryModel.updateOne({ _id: dataDto.id }, 
                    {
                        $set:{
                            name: dataDto.name
                        }
                    }
                )
            }else{
                throw new BadRequestException('invalid entry')
            }

            return { message: "successful", dataDto }

        } catch (error: any) {
            if (error instanceof BadRequestException && error.message === 'invalid entry') {
                throw error;
            } else {
                console.log('data error ' + error);            
                throw new InternalServerErrorException(`error processing request`);
            }
        }
    }

    // edit product
    async updateProduct(dataDto: any){
        try{
            let product = await this.brandModel.updateOne({ _id: dataDto.id }, 
                {
                    $set:{
                        name: dataDto.name
                    }
                }
            )

            if(!product){
                throw new BadRequestException('update error')
            }

            return { message: "update successful", dataDto }

        } catch (error: any) {
            if (error instanceof BadRequestException && error.message === 'update error') {
                throw error;
            } else {
                console.log('data error ' + error);            
                throw new InternalServerErrorException(`error processing request`);
            }
        }
    }

    
    // delete single category/brand/product by id
    async deleteOne(id: string, type: string) {
        try{
            let fetchData = []

            if(type === 'category'){
                fetchData = await this.categoryModel.findByIdAndDelete({ _id: id })

            }else if(type === 'brand'){
                fetchData = await this.brandModel.findByIdAndDelete({ _id: id })

            }else if(type === 'product'){
                fetchData = await this.productModel.findByIdAndDelete({ _id: id })

            }else{
                throw new NotFoundException('id not found')
            }

            return { message: "data deleted" }

        } catch (error: any) {
            if (error instanceof BadRequestException && error.message === 'id not found') {
                throw error;
            } else {
                console.log('data error ' + error);            
                throw new InternalServerErrorException(`error processing request`);
            }
        }
    }

}
