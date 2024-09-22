import { Post, Body, Controller, UseGuards, Get, Query, UploadedFiles, UseInterceptors, BadRequestException, Param, Patch, Delete, UploadedFile } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor  } from '@nestjs/platform-express';
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
    createData(@Body() body: { name: string, type: string, image?: string, brands?: [] }){       
        return this.productService.addData(body)
    }

    // upload multipl products img
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

    // upload single img
    @Post('/getimg')
    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(JwtAuthGuard)
    async getImg(@UploadedFile() file: Express.Multer.File){  
         
        let data: any = await this.uploadService.generateUploadURL(file)
        
        if(data === null){
            throw new BadRequestException('error uploading product files')
        }
        
        return data
    }

    // upload flyer
    @Post('/flyer')
    @UseGuards(JwtAuthGuard)
    async createFlyer(@Body() body: any){
        // Call the productService to add the product
        return this.productService.addFlyer(body);
    }

    // upload product
    @Post('/product')
    @UseGuards(JwtAuthGuard)
    async createProduct(@Body() body: ProductDto){
        // Call the productService to add the product
        return this.productService.addProduct(body);
    }

    // get all products, brand, category or flyer depending on query
    @Get()
    getAllElements(@Query() query: Record<string, any>) {
        return this.productService.getAll(query);
    }

    // get all products with compression
    @Get('/data')
    getAllElementsCompressed() {
        return this.productService.getAllCompressed();
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
    @Get('/productratingcount/:productid')
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
    editData(@Body() body: { id: string, name?: string, type: string, image?: string, section?: string }){       
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

            let slug = product.slug

            if (!slug) {
                if (body.name && product.name !== body.name) {
                    slug = body.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                    slug += '-' + Math.floor(Math.random() * Date.now()).toString(16);
                } else {
                    slug = product.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                    slug += '-' + Math.floor(Math.random() * Date.now()).toString(16);
                }
            } else if (body.name && product.name !== body.name) {
                slug = body.name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
                slug += '-' + Math.floor(Math.random() * Date.now()).toString(16);
            }
            

            body.slug = slug;

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

    // delete flyer by id
    @Delete('/flyer/:id')
    deleteFlyerById(@Param('id') id: string){
        return this.productService.deleteOne(id, 'flyer')
    }



    // test code to edit general products
    @Patch('/all')
    allProducts(){
        return this.productService.allProducts()
    }
}
