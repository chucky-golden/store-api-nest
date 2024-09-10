import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { SendMailService } from '../mailer';
import { CartSchema, OrderSchema, SaveAddressSchema } from './schema/order.schema';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { AuthModule } from '../auth/auth.module';
import { ContactSchema } from './schema/contact.schema';
import { ProductSchema, RatingSchema, ReviewSchema } from 'src/admin/schema/products.schema';
import { FavouriteSchema } from './schema/favourite.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Order', schema: OrderSchema },
      { name: 'Favourite', schema: FavouriteSchema },
      { name: 'Contact', schema: ContactSchema },
      { name: 'Review', schema: ReviewSchema },
      { name: 'Rating', schema: RatingSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'SaveAddress', schema: SaveAddressSchema },
      { name: 'Cart', schema: CartSchema },
    ]),
  ],
  controllers: [UsersController, MeController],
  providers: [UsersService, MeService, SendMailService, SendMailService]
})
export class UsersModule {}
