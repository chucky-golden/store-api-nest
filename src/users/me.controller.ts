import { Post, Body, Controller, UseGuards, Get, Query, BadRequestException, Param, Patch, Delete } from '@nestjs/common';
import { JwtStrategy } from './jwt-strategy';
import { MeService } from './me.service';
import { CreateOrderDto } from './dto/user.dto';
import { UpdateOrderDto } from './dto/update-user.dto';


@Controller('/api/v1/users/me')
export class MeController {
    constructor(
        private meService: MeService,

    ) {}

    // add order
    @Post('/order')
    @UseGuards(JwtStrategy)
    createOrder(@Body() body: CreateOrderDto){       
        return this.meService.addOrder(body)
    }

    // get all orders for history
    @Get('/order/:email')
    getAllOrdersByEmail(@Param('email') email: string){     
        return this.meService.getAll(email)
    }

    // get product by id
    @Get('/order/:id')
    getOrderById(@Param('id') id: string){
        return this.meService.getOne(id)
    }

    // edit user profile
    @Patch('/editdata')
    @UseGuards(JwtStrategy)
    editData(@Body() body: UpdateOrderDto){       
        return this.meService.editData(body)
    }

    

    // delete product by id
    @Delete('/product/:id')
    deleteProductById(@Param('id') id: string){
        return this.meService.deleteOne(id, 'product')
    }

    // delete brand by id
    @Delete('/brand/:id')
    deleteBrandById(@Param('id') id: string){             
        return this.meService.deleteOne(id, 'brand')
    }

    // delete category by id
    @Delete('/category/:id')
    deleteCategoryById(@Param('id') id: string){
        return this.meService.deleteOne(id, 'category')
    }
}
