import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { User } from './schema/user.schema';

@Injectable()
export class MeService {
    constructor(
        // bringing in models
        @InjectModel(Order.name)
        private orderModel: Model<Order>,

        @InjectModel(User.name)
        private userModel: Model<User>,
    ){}


    // add order
    async addOrder(createOrderDto: CreateOrderDto) {
        try{
            let orderId: string = ''
            
            const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            
            for (let i = 0; i < 6; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                orderId += charset[randomIndex];
            }

            const order = await this.orderModel.create({ orderId, ...createOrderDto })
            return { message: "order created", order }

        } catch (error: any) {
            console.log('data error ' + error);            
            throw new InternalServerErrorException(`order cannot be created now`);  
        }
    }


    // get all users order using email
    async getAll(email: string ) {
        return await this.orderModel.find({ email }).sort({ createdAt: -1 })
    }


    // get single order by id
    async getOne(id: string) {
        try{
            return await this.orderModel.findOne({ _id: id })
        } catch (error: any) {
            console.log('data error ' + error);            
            throw new NotFoundException(`d not found`);
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

}
