import { Post, Body, Controller, UseGuards, Get, Param, Patch, NotFoundException } from '@nestjs/common';
import { MeService } from './me.service';
import { CreateOrderDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('/api/v1/users/me')
export class MeController {
    constructor(
        private meService: MeService

    ) {}

    // add order
    @Post('/orders')
    @UseGuards(JwtAuthGuard)
    createOrder(@Body() body: CreateOrderDto){       
        return this.meService.addOrder(body)
    }

    // get all orders for history
    @Get('/orders/:email')
    @UseGuards(JwtAuthGuard)
    getAllOrdersByEmail(@Param('email') email: string){     
        return this.meService.getAll(email)
    }

    // get order by id
    @Get('/order/:id')
    @UseGuards(JwtAuthGuard)
    getOrderById(@Param('id') id: string){
        return this.meService.getOne(id)
    }

    // edit order by id and set paid to 1
    @Patch('/order/:id')
    @UseGuards(JwtAuthGuard)
    updateOrderById(@Param('id') id: string){
        return this.meService.updateOrder(id)
    }

    // edit user profile
    @Patch('/:id')
    @UseGuards(JwtAuthGuard)
    editData(@Param('id') id: string, @Body() body: UpdateUserDto){       
        return this.meService.editData(id, body)
    }

    // edit user password
    @Patch('password/:id')
    @UseGuards(JwtAuthGuard)
    editPassword(@Param('id') id: string, @Body() body: UpdateUserDto){       
        return this.meService.editPassword(id, body)
    }
}
