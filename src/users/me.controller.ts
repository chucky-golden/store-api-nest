import { Post, Body, Controller, UseGuards, Get, Param, Patch, NotFoundException, Query, Delete } from '@nestjs/common';
import { MeService } from './me.service';
import { CreateOrderDto, CreateRating, CreateReview } from './dto/user.dto';
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

    // add product to favourite
    @Post('/addsavedaddress')
    @UseGuards(JwtAuthGuard)
    addSavedAddress(@Body() body: any){       
        return this.meService.addSavedAddress(body)
    }

    // add product to favourite
    @Post('/addfavourite')
    @UseGuards(JwtAuthGuard)
    addFavourite(@Body() body: { productId: string, userId: string }){       
        return this.meService.addProductToFavourite(body)
    }

    // add review
    @Post('/review')
    @UseGuards(JwtAuthGuard)
    createReview(@Body() body: CreateReview){       
        return this.meService.addReview(body)
    }

    // add rating
    @Post('/rating')
    @UseGuards(JwtAuthGuard)
    createRating(@Body() body: CreateRating){       
        return this.meService.addRating(body)
    }

    // get arrays from frontend and update product selling count.
    @Post('/updatecount')
    @UseGuards(JwtAuthGuard)
    updateCount(@Body() body: any){       
        return this.meService.updateCount(body)
    }

    // get top selling
    @Get('/topselling')
    @UseGuards(JwtAuthGuard)
    getTopSelling(){     
        return this.meService.getTopSelling()
    }

    // get arrays from frontend and update product selling count.
    @Post('/cart')
    @UseGuards(JwtAuthGuard)
    createCart(@Body() body: any){       
        return this.meService.createCart(body)
    }

    // get top selling
    @Get('/cart/:userid')
    @UseGuards(JwtAuthGuard)
    getCart(@Param('userid') userid: string){
        return this.meService.getCart(userid)
    }

    // get all reviews saved to draft
    @Get('/reviews/:userid')
    @UseGuards(JwtAuthGuard)
    getAllUserDraftReviews(@Param('userid') userid: string, @Query() query: Record<string, any>){     
        return this.meService.getAllUserReviews(userid, query)
    }

    // get all saved address
    @Get('/savedaddress/:userid')
    @UseGuards(JwtAuthGuard)
    getAllSavedAddress(@Param('userid') userid: string, @Query() query: Record<string, any>){     
        return this.meService.getAllSavedAddress(userid, query)
    }

    // get all orders for history
    @Get('/orders/:email')
    @UseGuards(JwtAuthGuard)
    getAllOrdersByEmail(@Param('email') email: string, @Query() query: Record<string, any>){
        return this.meService.getAll(email, query)
    }

    // check if a product is saved to favourite
    @Get('/checksavead')
    @UseGuards(JwtAuthGuard)
    checkSaved(@Query() query: Record<string, any>){     
        return this.meService.checkSaved(query)
    }

    // get all product saved to favourite by a user
    @Get('/getsavead/:userid')
    @UseGuards(JwtAuthGuard)
    getSaved(@Param('userid') userid: string, @Query() query: Record<string, any>){     
        return this.meService.getSaved(userid, query)
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

    // delete product saved to favourite by id
    @Delete('addfavourite/:userid')
    @UseGuards(JwtAuthGuard)
    deleteFavourite(@Param('userid') userid: string, @Query() query: Record<string, any>){       
        return this.meService.deleteFavourite(userid, query)
    }

    // edit saved Review
    @Patch('savedreview/:id')
    @UseGuards(JwtAuthGuard)
    editSavedReview(@Param('id') id: string, @Body() body: any){       
        return this.meService.editSavedReview(id, body)
    }

    // delete saved review
    @Delete('savedreview/:id')
    @UseGuards(JwtAuthGuard)
    deleteSavedReview(@Param('id') id: string){       
        return this.meService.deleteSavedReview(id)
    }

    // delete saved review
    @Delete('savedaddress/:addressid')
    @UseGuards(JwtAuthGuard)
    deleteSavedAddress(@Param('addressid') addressid: string){       
        return this.meService.deleteSavedAddress(addressid)
    }
}
