import { Post, Body, Controller, UseGuards, Get, Query, Param, Patch } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { MyUsersService } from './myusers.service';


@Controller('/api/v1/admin/users')
export class MyUsersController {
    constructor(
        private myUsersService: MyUsersService
    ) {}
    
    // get all orders/users depending on query
    @Get()
    getAllElements(@Query() query: Record<string, any>){     
        return this.myUsersService.getAll(query)
    }

    // get order by id
    @Get('/order/:id')
    getOrderById(@Param('id') id: string){
        return this.myUsersService.getOne(id, 'order')
    }

    // get user by id
    @Get('/user/:id')
    getUserById(@Param('id') id: string){             
        return this.myUsersService.getOne(id, 'user')
    }

    // get user by id
    @Get('/swap/:id')
    getSwapById(@Param('id') id: string){             
        return this.myUsersService.getOne(id, 'swap')
    }

    // edit order
    @Patch('/editorder')
    @UseGuards(JwtAuthGuard)
    editOrder(@Body() body: { id: string, status: string }){       
        return this.myUsersService.editOrder(body)
    }

    // edit user
    @Patch('/edituser')
    @UseGuards(JwtAuthGuard)
    editUser(@Body() body: { id: string, active: number }){       
        return this.myUsersService.editUser(body)
    }
    
    // edit swapped
    @Patch('/editswap')
    @UseGuards(JwtAuthGuard)
    editSawp(@Body() body: { id: string, status: string }){       
        return this.myUsersService.editSawp(body)
    }

    
}
