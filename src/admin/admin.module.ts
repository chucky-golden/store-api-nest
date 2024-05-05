import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminSchema } from './schema/admin.schema';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UploadService } from './common/cloudinary';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { SendMailService } from '../mailer';
import { CategorySchema, BrandSchema, ProductSchema } from './schema/products.schema';
import { JwtStrategy } from './jwt-strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRE')
          }
        }
      }
    }),
    MongooseModule.forFeature([
      { name: 'Admin', schema: AdminSchema }, 
      { name: 'Category', schema: CategorySchema },
      { name: 'Brand', schema: BrandSchema },
      { name: 'Product', schema: ProductSchema }
    ])
  ],
  controllers: [AdminController, ProductController],
  providers: [AdminService, UploadService, ProductService, SendMailService, JwtStrategy, PassportModule]
})
export class AdminModule {}
