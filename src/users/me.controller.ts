import { Post, Body, Controller, UseGuards, Get, Param, Patch } from '@nestjs/common';
import { MeService } from './me.service';
import { CreateOrderDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('/api/v1/users/me')
export class MeController {
    constructor(
        private meService: MeService

    ) {}

    // add order
    @Post('/order')
    @UseGuards(AuthGuard('jwt'))
    createOrder(@Body() body: CreateOrderDto){       
        return this.meService.addOrder(body)
    }

    // get all orders for history
    @Get('/order/:email')
    @UseGuards(AuthGuard('jwt'))
    getAllOrdersByEmail(@Param('email') email: string){     
        return this.meService.getAll(email)
    }

    // get product by id
    @Get('/order/:id')
    @UseGuards(AuthGuard('jwt'))
    getOrderById(@Param('id') id: string){
        return this.meService.getOne(id)
    }

    // edit user profile
    @Patch('/:id')
    @UseGuards(AuthGuard('jwt'))
    editData(@Param('id') id: string, @Body() body: UpdateUserDto){       
        return this.meService.editData(id, body)
    }

    // edit user password
    @Patch('password/:id')
    @UseGuards(AuthGuard('jwt'))
    editPassword(@Param('id') id: string, @Body() body: UpdateUserDto){       
        return this.meService.editPassword(id, body)
    }
}
