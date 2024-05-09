import { Post, Body, Controller, UseGuards, Get, Query, UploadedFile, UseInterceptors, BadRequestException, Param, Patch, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

    // upload product
    @Post('/product')
    @UseInterceptors(FileInterceptor('image'))
    @UseGuards(JwtAuthGuard)
    async createProduct(@UploadedFile() image: Express.Multer.File, @Body() body: ProductDto){   
        let data: any = await this.uploadService.generateUploadURL(image);
        if(data === null){
            throw new BadRequestException('error uploading product image')
        }
        
        // Combine body and upload data into a single object
        const productData = { ...body, ...data };

        // Call the productService to add the product
        return this.productService.addProduct(productData);
    }

    // get all products, brand or category depending on query
    @Get()
    getAllElements(@Query('type') type: "category" | "product" | "brand"){     
        return this.productService.getAll(type)
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
    @UseInterceptors(FileInterceptor('image'))
    async editProduct(@UploadedFile() image: Express.Multer.File, @Body() body: any,
    ) {
        try {
            // Retrieve the product data from the database
            const product:any = await this.productService.getOne(body.id, 'product')
            
            if (!product) {
                throw new BadRequestException('Product not found');
            }

            // If a new image is provided, delete the current image from Cloudinary
            if (image) {
                await this.uploadService.deleteImage(product.publicId);

                // Upload the new image to Cloudinary
                const newImageData:any = await this.uploadService.generateUploadURL(image);

                // Update the product data with the new image URL and public ID
                body = {
                    ...body,
                    ...newImageData
                };
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
