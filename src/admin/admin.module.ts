import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from './schema/admin.schema';
import { UploadService } from './common/cloudinary';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { SendMailService } from '../mailer';
import { CategorySchema, BrandSchema, ProductSchema } from './schema/products.schema';
import { AuthModule } from '../auth/auth.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    // AuthModule,
    MongooseModule.forFeature([
      { name: 'Admin', schema: AdminSchema }, 
      { name: 'Category', schema: CategorySchema },
      { name: 'Brand', schema: BrandSchema },
      { name: 'Product', schema: ProductSchema }
    ])
  ],
  controllers: [AdminController, ProductController],
  providers: [AdminService, UploadService, ProductService, SendMailService, JwtService]
})
export class AdminModule {}
