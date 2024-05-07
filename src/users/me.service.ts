import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/user.dto';
import { UpdateOrderDto } from './dto/update-user.dto';

@Injectable()
export class MeService {
    constructor(
        // bringing in models
        @InjectModel(Order.name)
        private orderModel: Model<Order>,
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


    // edit category / brand
    async editData(updateOrderDto: UpdateOrderDto) {
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

}
