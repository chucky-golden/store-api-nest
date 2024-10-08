import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category, Brand, Product, Review, Rating, Flyer } from './schema/products.schema';
import mongoose, { Model } from 'mongoose';
import { User } from '../users/schema/user.schema';
import { compressSent } from './common/compression';

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

        @InjectModel(Rating.name)
        private ratingModel: Model<Rating>,

        @InjectModel(User.name)
        private userModel: Model<User>,

        @InjectModel(User.name)
        private flyerModel: Model<Flyer>
    ){}

    // add category / brand
    async addData(dataDto: { name: string, type: string, image?: string, brands?: [] }) {
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

    // add flyer
    async addFlyer(flyerDto: any) {       
        
        try{
            const flyer = await this.flyerModel.create(flyerDto)

            return { message: "flyer added", flyer }

        } catch (error: any) {
            console.log('flyer error ' + error);            
            throw new InternalServerErrorException(`flyer cannot be created now`);
        }
    }

    // add product
    async addProduct(productDto: any) {       
        
        try{
            let slug = productDto.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            slug += '-' + Math.floor(Math.random() * Date.now()).toString(16);

            const product = await this.productModel.create({ ...productDto, slug })

            return { message: "product added", product }

        } catch (error: any) {
            console.log('product error ' + error);            
            throw new InternalServerErrorException(`product cannot be created now`);
        }
    }

    // get all product/brand/category/flyer
    async getAll(query: any ) {

        if (query.type === 'category') {
            const data = await this.categoryModel.find().sort({ createdAt: -1 })
            return {
                data
            }

        } else if (query.type === 'brand') {
            const data = await this.brandModel.find().sort({ createdAt: -1 })
            return {
                data
            }

        } else if (query.type === 'product') {
            const filters: any = {}
            const featureConditions: any = {};

            if (query.isFeatured !== undefined) {
                featureConditions.isFeatured = query.isFeatured === 'true';
            }
        
            if (query.isBestDeal !== undefined) {
                featureConditions.isBestDeal = query.isBestDeal === 'true';
            }
        
            if (query.isFeaturedBestDeal !== undefined) {
                featureConditions.isFeaturedBestDeal = query.isFeaturedBestDeal === 'true';
            }
        
            if (query.salePrice !== undefined) {
                featureConditions.salePrice = query.salePrice;
            }
        
            if (query.hot !== undefined) {
                featureConditions.hot = query.hot === 'true';
            }
        
            if (query.state !== undefined) {
                featureConditions.state = query.state;
            }
        
            // Add the conditions to the filters if any feature conditions exist
            if (Object.keys(featureConditions).length > 0) {
                filters["features"] = { $elemMatch: featureConditions };
            }

            if (query.brand) {
                filters.brand = { $regex: query.brand, $options: 'i' };
            }

            if (query.category) {
                filters.category = { $regex: query.category, $options: 'i' };
            }

            if (query.price) {
                const [minPrice, maxPrice] = query.price.split('-').map(Number)
                filters.price = {
                    $gte: minPrice,
                    $lte: maxPrice,
                }
            }

            if (query.name) {
                filters.name = { $regex: query.name, $options: 'i' };
            }


            const resPerPage = 15;
            const currentPage = Number(query.page) || 1;
            const skip = resPerPage * (currentPage - 1);

            const totalDocuments = await this.productModel.countDocuments(filters);
            const products = await this.productModel.find(filters)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(resPerPage);

            const totalPages = Math.ceil(totalDocuments / resPerPage);
            const hasPreviousPage = currentPage > 1;
            const hasNextPage = currentPage < totalPages;

            const data = await Promise.all(products.map(async (product) => {
                const ratingData = await this.getProductByRatingCount(product._id.toString());
                return {
                    ...product.toObject(),
                    ratingCount: ratingData.data.totalRatings,
                    ratingCounts: ratingData.data.ratingCounts,
                    sumRating: ratingData.data.sumRating
                };
            }));


            return {
                data,
                totalDocuments,
                hasPreviousPage,
                previousPage: hasPreviousPage ? currentPage - 1 : null,
                hasNextPage,
                nextPage: hasNextPage ? currentPage + 1 : null,
                totalPages,
                currentPage
            };

        } else if (query.type === 'flyer') {
            const data = await this.flyerModel.find().sort({ createdAt: -1 })
            return {
                data
            }

        } else {
            throw new NotFoundException('Invalid type');
        }
    }


    // get all product compressed
    async getAllCompressed() {
        const products = await this.productModel.find().sort({ createdAt: -1 });

        // Fetch rating information for each product
        const data = await Promise.all(products.map(async (product) => {
            const ratingData = await this.getProductByRatingCount(product._id.toString()); // Fetch rating data
            return {
                ...product.toObject(),
                ratingCount: ratingData.data.totalRatings,
                ratingCounts: ratingData.data.ratingCounts,
                sumRating: ratingData.data.sumRating
            }
        }))

        const compressedData = await compressSent(data)

        return { compressedData }
    }

    // get single product review
    async getProductReviews(query: any, id: string){
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException('Please enter a correct id');
        }

        const resPerPage = 10;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        const totalDocuments = await this.reviewModel.countDocuments({ productId: id, draft: false });
        const reviews = await this.reviewModel.find({ productId: id, draft: false })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(resPerPage);

        // Fetch user information for each review
        const data = await Promise.all(reviews.map(async (review) => {
            const user = await this.userModel.findById(review.userId, 'name'); // Fetch only the name field
            return {
                ...review.toObject(), // Convert Mongoose document to plain JS object
                userName: user ? user.name : 'Unknown User'
            };
        }));

        const totalPages = Math.ceil(totalDocuments / resPerPage);
        const hasPreviousPage = currentPage > 1;
        const hasNextPage = currentPage < totalPages;

        return {
            data,
            totalDocuments,
            hasPreviousPage,
            previousPage: hasPreviousPage ? currentPage - 1 : null,
            hasNextPage,
            nextPage: hasNextPage ? currentPage + 1 : null,
            totalPages,
            currentPage
        };
    }

    // get single product rating
    async getProductRating(query: any, id: string){

        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException('Please enter a correct id');
        }

        const resPerPage = 10;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        const totalDocuments = await this.ratingModel.countDocuments({ productId: id });
        const ratings = await this.ratingModel.find({ productId: id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(resPerPage);

        // Fetch user information for each review
        const data = await Promise.all(ratings.map(async (review) => {
            const user = await this.userModel.findById(review.userId, 'name'); // Fetch only the name field
            return {
                ...review.toObject(), // Convert Mongoose document to plain JS object
                userName: user ? user.name : 'Unknown User'
            };
        }));

        const totalPages = Math.ceil(totalDocuments / resPerPage);
        const hasPreviousPage = currentPage > 1;
        const hasNextPage = currentPage < totalPages;

        return {
            data,
            totalDocuments,
            hasPreviousPage,
            previousPage: hasPreviousPage ? currentPage - 1 : null,
            hasNextPage,
            nextPage: hasNextPage ? currentPage + 1 : null,
            totalPages,
            currentPage
        }
    }

    // get single product review count
    async getProductByRatingCount(_id: string){
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
        try{
            let fetchData:any;
            if(type === 'category'){
                fetchData = await this.categoryModel.findOne({ _id: id })

            }else if(type === 'brand'){
                fetchData = await this.brandModel.findOne({ _id: id })

            }else if(type === 'product'){
                let query: any = mongoose.isValidObjectId(id) ? { _id: id } : { slug: id };

                let data: any = await this.productModel.findOne(query);

                if (!data) {
                    console.log(`Product not found for id/slug: ${id}`);
                    throw new NotFoundException('Product not found');
                }
    
                const ratingCount = await this.getProductByRatingCount(data._id)
    
                let similarProduct = await this.productModel.find({ 
                    category: data.category, 
                    brand: data.brand,
                    _id: { $ne: data._id }
                }).limit(10);

                let newData = {
                    'product': data,
                    'similarProducts': similarProduct,
                    ratingCount
                }
                
                fetchData = newData
            }else{
                throw new NotFoundException('id not found')
            }

            return fetchData
        } catch (error: any) {
            console.error('Error:', error);

            if (error instanceof NotFoundException && error.message === 'id not found') {
                throw error;
            } 
            else if(error instanceof BadRequestException){
                throw error;
            } else {
                console.log('data error ' + error);            
                throw new InternalServerErrorException(`error processing request`);
            }
        }
    }


    // edit category / brand
    async editData(dataDto: { id: string, name?: string, type: string, image?: string, section?: string }) {
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
                await this.categoryModel.findOneAndUpdate({ _id: dataDto.id }, 
                    { $set: dataDto },
                    { new: true }
                )
                
            }else if(dataDto.type === 'flyer'){
                await this.flyerModel.findOneAndUpdate({ _id: dataDto.id }, 
                    { $set: dataDto },
                    { new: true }
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
            let product = await this.productModel.findOneAndUpdate({ _id: dataDto.id }, 
                { $set: dataDto },
                { new: true }
            )

            if(!product){
                throw new BadRequestException('update error')
            }

            return { message: "update successful", product }

        } catch (error: any) {
            if (error instanceof BadRequestException) {
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

            }else if(type === 'flyer'){
                await this.flyerModel.findByIdAndDelete({ _id: id })

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






    
    // // test code to edit all product
    async allProducts() {
        try {
          const productsWithoutSlug = await this.productModel.find({ slug: { $exists: false } });
      
          for (let product of productsWithoutSlug) {
            let slug = product.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            slug += '-' + Math.floor(Math.random() * Date.now()).toString(16);
            
            product.slug = slug;
            await product.save();
          }
      
          return { message: "Slugs updated successfully" };
      
        } catch (error: any) {
          console.log('data error ' + error);
          throw new InternalServerErrorException(`Error processing request`);
        }
      }
      

}
