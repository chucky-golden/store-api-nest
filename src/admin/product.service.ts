import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, Brand, Product, Review } from './schema/products.schema';
import mongoose, { Model } from 'mongoose';
import { paginate } from './common/pagination'

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

        @InjectModel(Review.name)
        private reviewModel: Model<Review>,
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
    async getAll(query: any ) {
        let result;

        if (query.type === 'category') {
            result = await paginate(this.categoryModel, query);
        } else if (query.type === 'brand') {
            result = await paginate(this.brandModel, query);
        } else if (query.type === 'product') {
            result = await paginate(this.productModel, query);
        } else {
            throw new NotFoundException('Invalid type');
        }

        return result;
    }

    // get single product review
    async getProductReviews(query: any, _id: string){
        const isValidId = mongoose.isValidObjectId(_id)

        if(!isValidId){
            throw new BadRequestException('please enter a correct id')
        }

        return await paginate(this.reviewModel, query, { _id });
    }

    // get single product review count
    async getProductByReviewCount(_id: string){
        const isValidId = mongoose.isValidObjectId(_id)

        if(!isValidId){
            throw new BadRequestException('please enter a correct id')
        }

        // Aggregate ratings count and sum of ratings for the specified userId
        const ratingData = await this.reviewModel.aggregate([
            { $match: { productId: _id } },
            {
                $group: {
                    _id: "$rating",
                    count: { $sum: 1 },
                    sumRating: { $sum: "$rating" }
                }
            }
        ])

        // Convert the aggregation result to a more readable format
        const ratingCountsMap: any = {};
        let totalSumRating = 0;
        ratingData.forEach((item: any) => {
            ratingCountsMap[item._id] = item.count;
            totalSumRating += item.sumRating;
        });

        // Ensure all rating values (1-5) are present in the map, even if the count is 0
        for (let i = 1; i <= 5; i++) {
            if (!ratingCountsMap[i]) {
                ratingCountsMap[i] = 0;
            }
        }

        // Get cumulative count of ratings
        const totalRatings = await this.reviewModel.countDocuments({ productId: _id });
    
        return {
            data: {
                totalRatings,
                ratingCounts: ratingCountsMap,
                sumRating: totalSumRating
            }
        }
    }

    // get single category/brand/product by id
    async getOne(id: string, type: string) {
        const isValidId = mongoose.isValidObjectId(id)

        if(!isValidId){
            throw new BadRequestException('please enter a correct id')
        }
        
        try{
            let fetchData:any;
            if(type === 'category'){
                fetchData = await this.categoryModel.findOne({ _id: id })

            }else if(type === 'brand'){
                fetchData = await this.brandModel.findOne({ _id: id })

            }else if(type === 'product'){
                let data: any = await this.productModel.findOne({ _id: id })
                let similarProduct = await this.productModel.find({ category: data.category, brand: data.brand }).limit(10)
                let newData = {
                    'product': data,
                    'similarProducts': similarProduct
                }
                fetchData = newData
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
        const isValidId = mongoose.isValidObjectId(dataDto.id)

        if(!isValidId){
            throw new BadRequestException('please enter a correct id')
        }

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
        const isValidId = mongoose.isValidObjectId(dataDto.id)

        if(!isValidId){
            throw new BadRequestException('please enter a correct id')
        }
        
        try{
            let product = await this.brandModel.findOneAndUpdate({ _id: dataDto.id }, 
                { $set: dataDto },
                { new: true }
            )

            if(!product){
                throw new BadRequestException('update error')
            }

            return { message: "update successful", product }

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
        const isValidId = mongoose.isValidObjectId(id)

        if(!isValidId){
            throw new BadRequestException('please enter a correct id')
        }
        
        try{
            if(type === 'category'){
                await this.categoryModel.findByIdAndDelete({ _id: id })

            }else if(type === 'brand'){
                await this.brandModel.findByIdAndDelete({ _id: id })

            }else if(type === 'product'){
                await this.productModel.findByIdAndDelete({ _id: id })

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
