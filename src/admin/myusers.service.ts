import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Order } from '../users/schema/order.schema';
import { User } from '../users/schema/user.schema';
// import { paginate } from './common/pagination'

@Injectable()
export class MyUsersService {
    constructor(
        // bringing in models
        @InjectModel(Order.name)
        private orderModel: Model<Order>,

        @InjectModel(User.name)
        private userModel: Model<User>
    ){}


    // get all product/brand/orders
    async getAll(query: any) {
        let result;

        if(query.type === 'orders'){
            const data = await this.orderModel.find().sort({ createdAt: -1 })
            return {
                data
            };
        }else if(query.type === 'users'){
            const data = await this.userModel.find().sort({ createdAt: -1 })
            return {
                data
            };            
        }else{
            throw new NotFoundException('invalid data (type parameter not specified)')
        }

        return result
    }
    

    // get single order/user by id
    async getOne(id: string, type: string) {
        const isValidId = mongoose.isValidObjectId(id)

        if(!isValidId){
            throw new BadRequestException('please enter a correct id')
        }
        
        try{
            let fetchData:any;
            if(type === 'order'){
                fetchData = await this.orderModel.findOne({ _id: id })

            }else if(type === 'user'){
                fetchData = await this.userModel.findOne({ _id: id })

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


    // edit order status
    async editOrder(dataDto: { id: string, status: string }) {

        const isValidId = mongoose.isValidObjectId(dataDto.id)

        if(!isValidId){
            throw new BadRequestException('please enter a correct id')
        }

        try{

            let orderData = await this.orderModel.findOneAndUpdate({ _id: dataDto.id }, 
                {
                    $set:{
                        status: dataDto.status
                    }
                },
                { new: true }
            )
            

            return { message: "update successful", orderData }

        } catch (error: any) {
            if (error instanceof BadRequestException && error.message === 'invalid entry') {
                throw error;
            } else {
                console.log('data error ' + error);            
                throw new InternalServerErrorException(`error processing request`);
            }
        }
    }


    // edit user account status
    async editUser(dataDto: { id: string, active: number }) {

        const isValidId = mongoose.isValidObjectId(dataDto.id)

        if(!isValidId){
            throw new BadRequestException('please enter a correct id')
        }

        try{

            let userData = await this.userModel.findOneAndUpdate({ _id: dataDto.id }, 
                {
                    $set:{
                        active: dataDto.active
                    }
                },
                { new: true }
            )
            

            return { message: "update successful", userData }

        } catch (error: any) {
            if (error instanceof BadRequestException && error.message === 'invalid entry') {
                throw error;
            } else {
                console.log('data error ' + error);            
                throw new InternalServerErrorException(`error processing request`);
            }
        }
    }


}
