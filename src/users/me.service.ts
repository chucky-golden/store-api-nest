import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, SaveAddress } from './schema/order.schema';
import mongoose, { Model } from 'mongoose';
import { CreateOrderDto, CreateRating, CreateReview } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from './schema/user.schema';
import { paginate } from './common/pagination'
import { Product, Rating, Review } from 'src/admin/schema/products.schema';
import { Favourite } from './schema/favourite.schema';

@Injectable()
export class MeService {
    constructor(
        // bringing in models
        @InjectModel(Order.name)
        private orderModel: Model<Order>,

        @InjectModel(User.name)
        private userModel: Model<User>,

        @InjectModel(Review.name)
        private reviewModel: Model<Review>,

        @InjectModel(Rating.name)
        private ratingModel: Model<Rating>,

        @InjectModel(Product.name)
        private productModel: Model<Product>,

        @InjectModel(Favourite.name)
        private favouriteModel: Model<Favourite>,

        @InjectModel(SaveAddress.name)
        private saveAddressModel: Model<SaveAddress>,
    ){}


    // add order
    async addOrder(createOrderDto: CreateOrderDto) {
        try{
            const { userId, state, address} = createOrderDto

            let orderId: string = 'order-'
            
            const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            
            for (let i = 0; i < 6; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                orderId += charset[randomIndex];
            }

            const order = await this.orderModel.create({ orderId, ...createOrderDto })
            await this.saveAddressModel.create({ userId, state, address })
            
            return { message: "order created", order }

        } catch (error: any) {
            console.log('data error ' + error);            
            throw new InternalServerErrorException(`order cannot be created now`);  
        }
    }


    // add order
    async addProductToFavourite(createFavouriteDto: { productId: string, userId: string }) {
        try{
            const { productId, userId } = createFavouriteDto
            const checkSaved = await this.favouriteModel.find({ productId, userId })

            // Check if any favourite product were found
            if (checkSaved.length !== 0) {
                return { message: 'product already added', checkSaved };
            }

            const order = await this.favouriteModel.create({ ...createFavouriteDto })
            return { message: "product added to favourite", order }

        } catch (error: any) {
            console.log('data error ' + error);            
            throw new InternalServerErrorException(`product cannot be added now`);  
        }
    }


    // add order
    async addReview(createReview: CreateReview) {
        try{
            const review = await this.reviewModel.create({ ...createReview })
            return { message: "review created", review }

        } catch (error: any) {
            console.log('data error ' + error);            
            throw new InternalServerErrorException(`review cannot be created now`);  
        }
    }


    // add order
    async addRating(createReview: CreateRating) {
        try{
            const rating = await this.ratingModel.create({ ...createReview })
            return { message: "rating created", rating }

        } catch (error: any) {
            console.log('data error ' + error);            
            throw new InternalServerErrorException(`rating cannot be created now`);  
        }
    }


    // check if a product is saved to favourite
    async checkSaved(query: any) {

        const { userId, productId } = query

        if(!userId && !productId){
            return { message: 'Please add a userId or productId to query' };
        }

        // Validate the user IDs
        const isValidUserId = mongoose.isValidObjectId(userId);
        const isValidProductId = mongoose.isValidObjectId(productId);

        if (!isValidUserId || !isValidProductId) {
            return { message: 'Please enter valid userId and productId' };
        }

        const checkSaved = await this.favouriteModel.find({ productId, userId })

        // Check if any favourite product were found
        if (checkSaved.length !== 0 || !checkSaved) {
            return { message: 'not saved', data: false };
        }else{
            return { message: 'saved', data: true };
        }
    }


    // get all users order using email
    async getAll(email: string, query: any) {
        return await paginate(this.orderModel, query, { email })
    }

    // get all users reviews using userid
    async getAllUserReviews(userId: string, query: any) {
        return await paginate(this.reviewModel, query, { userId, draft: true })
    }

    // get all users saved address using userid
    async getAllSavedAddress(userId: string, query: any) {
        return await paginate(this.saveAddressModel, query, { userId })
    }


    // get all product saved to favourite by a user
    async getSaved(userId: string, query: any) {
        try{
            const isValidId = mongoose.isValidObjectId(userId)

            if(!isValidId){
                return { message: 'Please enter a valid id' };
            }

            const resPerPage = 10
            const currentPageNum = Number(query.page) || 1
            const skip = resPerPage * (currentPageNum - 1)

            
            const existingRecords = await this.favouriteModel.find({ userId }).lean()
            .limit(resPerPage)
            .skip(skip)
            
            if (!existingRecords || existingRecords.length === 0) {
                return { 
                    message: { 
                        existingRecords, 
                        totalDocuments: 0,
                        hasPreviousPage: false, 
                        previousPages: 0, 
                        hasNextPage: false,      
                        nextPages: 0,
                        totalPages: 0,
                        currentPage: currentPageNum
                    }
                }
            }

            // Extract productIds from savedAds
            const productIds: any = existingRecords.map((saveProduct: any) => saveProduct.productId);

            // Fetch product details for each productId
            const saved: any = await this.productModel.find({ _id: { $in: productIds } }).lean();

            // Count the total number of documents
            const totalDocuments = await this.favouriteModel.countDocuments({ userId });

            // Calculate the total number of pages
            const totalPages = Math.ceil(totalDocuments / resPerPage);

            // Determine if there are previous and next pages
            const hasPreviousPage = currentPageNum > 1;
            const hasNextPage = currentPageNum < totalPages

            // Calculate the number of previous and next pages available
            const previousPages = currentPageNum - 1;
            const nextPages = (totalPages - currentPageNum) < 0 ? 0 : totalPages - currentPageNum;
            

            return { 
                message: { 
                    existingRecords: saved, 
                    totalDocuments,
                    hasPreviousPage, 
                    previousPages, 
                    hasNextPage, 
                    nextPages,                    
                    totalPages,
                    currentPage: currentPageNum
                }
            }
        }catch (error: any) {
            console.log('message', error);            
            throw new InternalServerErrorException(`error processing request`);
        }
    }


    // get single order by id
    async getOne(id: string) {
        const isValidId = mongoose.isValidObjectId(id)

        if(!isValidId){
            throw new BadRequestException('please enter a correct id')
        }
        
        const order = await this.orderModel.findById(id)

        if(!order){
            throw new Error('order not found')
        }

        return order
    }


    // edit user order and set paid to 1 after payment is done
    async updateOrder(id: string) {

        const isValidId = mongoose.isValidObjectId(id)

        if(!isValidId){
            throw new BadRequestException('please enter a correct id')
        }        

        try{            
            const data = await this.orderModel.findOneAndUpdate(
                { _id: id },
                { $set: { paid: 1 } },
                { new: true }
            );

            return { message: 'order updated', data}

        } catch (error: any) {
            console.log('message', error);            
            throw new InternalServerErrorException(`error processing request`);
        }
    }

    // edit user profile
    async editData(id: string, updateUserDto: UpdateUserDto) {
        try{            
            let data = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
                // tells mongoose to return the updated data because by default it returns the original
                // data before updating was done
                new: true,    
                // tells mongoose to run the validations defined in the schema.
                runValidators: true
            })

            data.password = ''
            return { message: 'profile updated', data}

        } catch (error: any) {
            console.log('message', error);            
            throw new InternalServerErrorException(`error processing request`);
        }
    }

    // edit user password
    async editSavedReview(id: string, updateReviewDto: any) {
        try{
            let data = await this.reviewModel.findByIdAndUpdate(id, updateReviewDto, {
                new: true,
                runValidators: true
            })
            return { message: 'review added', data}

        } catch (error: any) {
            console.log('message', error);            
            throw new InternalServerErrorException(`error processing request`);
        }
    }

    // edit user password
    async editPassword(id: string, updateUserDto: UpdateUserDto) {
        try{
            const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
            updateUserDto = { ...updateUserDto, password: hashedPassword };

            let data = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
                // tells mongoose to return the updated data because by default it returns the original
                // data before updating was done
                new: true,    
                // tells mongoose to run the validations defined in the schema.
                runValidators: true
            })

            data.password = ''
            return { message: 'password updated', data}

        } catch (error: any) {
            console.log('message', error);            
            throw new InternalServerErrorException(`error processing request`);
        }
    }


    // delete product saved to favourite
    async deleteFavourite(id: string) {
        await this.favouriteModel.deleteOne({ _id: id })
        return { message: 'record deleted'}
    }

    // delete product saved to favourite
    async deleteSavedReview(id: string) {
        await this.reviewModel.deleteOne({ _id: id })
        return { message: 'record deleted'}
    }

}
