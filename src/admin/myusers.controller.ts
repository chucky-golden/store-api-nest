import { Post, Body, Controller, UseGuards, Get, Query, UploadedFile, UseInterceptors, BadRequestException, Param, Patch, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductDto } from './dto/admin.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 
import { MyUsersService } from './myusers.service';


@Controller('/api/v1/admin/users')
export class MyUsersController {
    constructor(
        private myUsersService: MyUsersService
    ) {}
    
    // get all orders/users depending on query
    @Get()
    getAllElements(@Query('type') type: "orders" | "users"){     
        return this.myUsersService.getAll(type)
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

    // edit category
    @Patch('/editorder')
    @UseGuards(JwtAuthGuard)
    editOrder(@Body() body: { id: string, status: string }){       
        return this.myUsersService.editOrder(body)
    }

    // edit category
    @Patch('/edituser')
    @UseGuards(JwtAuthGuard)
    editUser(@Body() body: { id: string, active: number }){       
        return this.myUsersService.editUser(body)
    }

    
}
