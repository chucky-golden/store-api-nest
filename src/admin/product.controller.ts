import { Post, Body, Controller, UseGuards, Get, Query, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductDto } from './dto/admin.dto';
import { ProductService } from './product.service';
import { JwtStrategy } from './jwt-strategy';
import { UploadService } from './common/cloudinary';


@Controller('/api/v1/admin/products')
export class ProductController {
    constructor(
        private productService: ProductService,

        // image upload service
        private readonly uploadService: UploadService
    ) {}

    @Post('/category')
    @UseGuards(JwtStrategy)
    createCategory(@Body() body: { name: string }){       
        return this.productService.addCategory(body)
    }

    @Post('/brand')
    @UseGuards(JwtStrategy)
    createBrand(@Body() body: { name: string }){       
        return this.productService.addBrand(body)
    }

    @Post('/product')
    @UseInterceptors(FileInterceptor('image'))
    @UseGuards(JwtStrategy)
    createProduct(@UploadedFile() image: Express.Multer.File, @Body() body: ProductDto){   

        let data = this.uploadService.generateUploadURL(image)
        if(data === null){
            throw new BadRequestException('error uploading product image')
        }

        return this.productService.addProduct({ body, ...data })
    }

    // get all products, brand or category depending on query
    @Get()
    getAllElements(@Query('type') type: "category" | "product" | "brand"){     
        return this.productService.getAll(type)
    }
}
