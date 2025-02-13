import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, Order, SaveAddress, Swapped } from './schema/order.schema';
import mongoose, { Model } from 'mongoose';
import { CreateOrderDto, CreateRating, CreateReview, CreateSwapDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from './schema/user.schema';
import { paginate } from './common/pagination'
import { Product, Rating, Review } from 'src/admin/schema/products.schema';
import { Favourite } from './schema/favourite.schema';
import { mailGenerator, sendmail } from './common/mailer';

@Injectable()
export class MeService {
    constructor(
        // bringing in models
        @InjectModel(Order.name)
        private orderModel: Model<Order>,

        @InjectModel(Swapped.name)
        private swapModel: Model<Swapped>,

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

        @InjectModel(Cart.name)
        private cartModel: Model<Cart>,
    ){}


    // add order
    async addOrder(createOrderDto: CreateOrderDto) {
        try{
            let { userId = '', name, email, phone, country = '', city = '', address = '', lga = '', state = '', landmark = '', additionalNote = ''} = createOrderDto

            let orderId: string = 'order-'
            
            const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            
            for (let i = 0; i < 6; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                orderId += charset[randomIndex];
            }

            const user = await this.userModel.findOne({ email: email })
            if(!user){
                const userCreate = await this.userModel.create({ name, email, phone, address, country, state })

                var emailSender: any = {
                    body: {
                        name: name,
                        intro: 'Your order has been created and is being processed.\nTo track and see progress of order, log into account using the email you provided during shopping by first:\n1. Click the forgotten password link and enter the specified email.\n2. Reset your password\n3. Log into account with the new password and email.',
    
                        action: {
                            instructions: 'To get started, click button below',
                            button: {
                                color: '#ffffff',
                                text: `<span style="font-size: 30px; font-weight: bolder; color: black">Get Started</span>`,
                                link: 'https://www.churchillexpansions.com/'
                            }
                        },
                        
                        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.\n\n Team Churchil.'
                    }
                };
    
                let emailBody: any = mailGenerator.generate(emailSender);
    
                await sendmail(email, 'Email Verification', emailBody)

                userId = userCreate._id
            }else if(user && userId == ""){
                userId = user._id
            }

            const order = await this.orderModel.create({ orderId, ...createOrderDto })
            await this.saveAddressModel.create({ userId, phone, country, city, address, lga, state, landmark, additionalNote })
            
            return { message: "order created", order }

        } catch (error: any) {
            console.log('data error ' + error);            
            throw new InternalServerErrorException(`order cannot be created now`);  
        }
    }

    // add order
    async addSwap(createSwapDto: CreateSwapDto) {
        try{
            const swap = await this.swapModel.create(createSwapDto)
            
            return { message: "request received", swap }

        } catch (error: any) {
            console.log('data error ' + error);            
            throw new InternalServerErrorException(`request cannot be created now`);  
        }
    }


    // add product to favourite
    async addProductToFavourite(createFavouriteDto: { productId: string, userId: string }) {
        try{
            const { productId, userId } = createFavouriteDto;

            // Validate that both productId and userId are provided
            if (!productId || !userId) {
                return { message: 'Enter a valid productId and userId' };
            }

            // Check if the product is already in the user's favourites
            const checkSaved = await this.favouriteModel.findOne({ productId, userId });

            // Check if any favourite product were found
            if (checkSaved) {
                return { message: 'product already added', checkSaved };
            }

            const order = await this.favouriteModel.create(createFavouriteDto)
            return { message: "product added to favourite", order }

        } catch (error: any) {
            console.log('data error ' + error);            
            throw new InternalServerErrorException(`product cannot be added now`);  
        }
    }


    // add saved address
    async addSavedAddress(savedAddress: any) {
        try{
            const address = await this.saveAddressModel.create({ ...savedAddress })
            return { message: "address added", address }

        } catch (error: any) {
            console.log('data error ' + error);            
            throw new InternalServerErrorException(`address cannot be added now`);  
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
        return await paginate(this.orderModel, query, { email: email })
    }

    // get all users reviews using userid
    async getAllUserReviews(userId: string, query: any) {
        return await paginate(this.reviewModel, query, { userId: userId, draft: true })
    }

    // get all users saved address using userid
    async getTopSelling() {
        try {
            const data = await this.productModel.find()
                .sort({ sellingCount: -1 })
                .limit(20);
    
            return {
                data
            };
        } catch (error: any) {
            console.log('message', error);
            throw new InternalServerErrorException('Error fetching top selling products');
        }
    }

    // get all users saved address using userid
    async getAllSavedAddress(userId: string, query: any) {
        const data = await this.saveAddressModel.find({ userId })
        return { data }
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


    // add or update cart.
    async createCart(datas: any) {
        try {
            const { userId, cartData } = datas;
    
            const updatedCart = await this.cartModel.findOneAndUpdate(
                { userId },
                { $set: { cartData } },
                { new: true, upsert: true }
            );
    
            return { 
                message: updatedCart ? "cart updated" : "cart created", 
                cart: updatedCart 
            };
            
        } catch (error: any) {
            console.error('Error in createCart:', error.message || error);
            throw new InternalServerErrorException(`Error processing request`);
        }
    }
    

    // get all users saved address using userid
    async getCart(userId: string) {
        const data = await this.cartModel.find({ userId })
        return { data }
    }


    // get arrays from frontend and update product selling count.
    async updateCount(datas: string) {
        try{         
            for (const productId of datas) {
                await this.productModel.updateOne(
                    { _id: productId },
                    { $inc: { sellingCount: 1 } }
                );
            }

            return { message: 'product sellingCount updated'}

        } catch (error: any) {
            console.log('message', error);            
            throw new InternalServerErrorException(`error processing request`);
        }
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
                { $set: { paid: true } },
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
    async deleteFavourite(userid: string, query: any) {

        // Check if the provided ID is a valid MongoDB ObjectId
        const isValidUserId = mongoose.isValidObjectId(userid);
        const isValidProductId = mongoose.isValidObjectId(query.productid);
        if (!isValidUserId && !isValidProductId) {
            throw new BadRequestException('Please enter a correct user and product ID');
        }

        const result = await this.favouriteModel.findOneAndDelete({ productId: query.productid, userId: userid });

        if (!result) {
            throw new NotFoundException('Favourite not found');
        }

        return { message: 'record deleted successfully'}
    }


    // delete saved review
    async deleteSavedReview(id: string) {
        // Check if the provided ID is a valid MongoDB ObjectId
        const isValidId = mongoose.isValidObjectId(id);
        if (!isValidId) {
            throw new BadRequestException('Please enter a correct ID');
        }

        const result = await this.reviewModel.findByIdAndDelete(id);

        if (!result) {
            throw new NotFoundException('Favourite not found');
        }

        return { message: 'record deleted successfully'}
    }

    // delete saved review
    async deleteSavedAddress(id: string) {
        // Check if the provided ID is a valid MongoDB ObjectId
        const isValidId = mongoose.isValidObjectId(id);
        if (!isValidId) {
            throw new BadRequestException('Please enter a correct ID');
        }

        const result = await this.saveAddressModel.findByIdAndDelete(id);

        if (!result) {
            throw new NotFoundException('address not found');
        }

        return { message: 'record deleted successfully'}
    }

}
