import { Post, Body, Controller, UseGuards, Get, Query, UploadedFiles, UseInterceptors, BadRequestException, Param, Patch, Delete } from '@nestjs/common';
import { FilesInterceptor  } from '@nestjs/platform-express';
import { ProductDto } from './dto/admin.dto';
import { ProductService } from './product.service';
import { UploadService } from './common/cloudinary';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; 


@Controller('/api/v1/admin/products')
export class ProductController {
    constructor(
        private productService: ProductService,

        // image upload service
        private readonly uploadService: UploadService
    ) {}

    // add category/brand
    @Post('/data')
    @UseGuards(JwtAuthGuard)
    createData(@Body() body: { name: string, type: string }){       
        return this.productService.addData(body)
    }

    // upload products img
    @Post('/getproductimg')
    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(JwtAuthGuard)
    async getProductImg(@UploadedFiles() files: Express.Multer.File[]){  
         
        let data: any = await this.uploadService.generateUploadURLs(files)
        
        if(data === null){
            throw new BadRequestException('error uploading product files')
        }

        return data
    }

    // upload product
    @Post('/product')
    @UseGuards(JwtAuthGuard)
    async createProduct(@Body() body: ProductDto){
        // Call the productService to add the product
        return this.productService.addProduct(body);
    }

    // get all products, brand or category depending on query
   @Get()
    getAllElements(@Query() query: Record<string, any>) {
        return this.productService.getAll(query);
    }

    // get product review by id
    @Get('/productreviews/:productid')
    getProductReviews(@Query() query: Record<string, any>, @Param('productid') id: string){
        return this.productService.getProductReviews(query, id)
    }

    // get product rating by id
    @Get('/productratings/:productid')
    getProductRating(@Query() query: Record<string, any>, @Param('productid') id: string){
        return this.productService.getProductRating(query, id)
    }

    // get product review count by id
    @Get('/productreviewscount/:productid')
    getProductByRatingCount(@Param('productid') id: string){
        return this.productService.getProductByRatingCount(id)
    }

    // get product by id
    @Get('/product/:id')
    getProductById(@Param('id') id: string){
        return this.productService.getOne(id, 'product')
    }

    // get brand by id
    @Get('/brand/:id')
    getBrandById(@Param('id') id: string){             
        return this.productService.getOne(id, 'brand')
    }

    // get category by id
    @Get('/category/:id')
    getCategoryById(@Param('id') id: string){
        return this.productService.getOne(id, 'category')
    }

    // edit category
    @Patch('/editdata')
    @UseGuards(JwtAuthGuard)
    editData(@Body() body: { id: string, name: string, type: string }){       
        return this.productService.editData(body)
    }

    // edit product
    @Patch('/product')
    async editProduct(@Body() body: any,) {
        try {
            // Retrieve the product data from the database
            const product: any = await this.productService.getOne(body.id, 'product')
            
            if (!product) {
                throw new BadRequestException('Product not found');
            }

            // Update the product data
            const updatedProduct = await this.productService.updateProduct(body);

            return updatedProduct;

        }catch (error) {
            console.error('Error editing product:', error);
            throw new BadRequestException('Failed to edit product');
        }
    }

    // delete product by id
    @Delete('/product/:id')
    deleteProductById(@Param('id') id: string){
        return this.productService.deleteOne(id, 'product')
    }

    // delete brand by id
    @Delete('/brand/:id')
    deleteBrandById(@Param('id') id: string){             
        return this.productService.deleteOne(id, 'brand')
    }

    // delete category by id
    @Delete('/category/:id')
    deleteCategoryById(@Param('id') id: string){
        return this.productService.deleteOne(id, 'category')
    }
}
