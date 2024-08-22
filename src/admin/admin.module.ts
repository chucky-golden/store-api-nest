import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from './schema/admin.schema';
import { UploadService } from './common/cloudinary';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { SendMailService } from '../mailer';
import { CategorySchema, BrandSchema, ProductSchema, ReviewSchema, RatingSchema, FlyerSchema } from './schema/products.schema';
import { AuthModule } from '../auth/auth.module';
import { MyUsersController } from './myusers.controller';
import { MyUsersService } from './myusers.service';
import { UserSchema } from 'src/users/schema/user.schema';
import { OrderSchema } from 'src/users/schema/order.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'Admin', schema: AdminSchema }, 
      { name: 'Category', schema: CategorySchema },
      { name: 'Brand', schema: BrandSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Review', schema: ReviewSchema },
      { name: 'Rating', schema: RatingSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Order', schema: OrderSchema },
      { name: 'Flyer', schema: FlyerSchema }
    ])
  ],
  controllers: [AdminController, ProductController, MyUsersController],
  providers: [AdminService, UploadService, ProductService, MyUsersService, SendMailService]
})
export class AdminModule {}
