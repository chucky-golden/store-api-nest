import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { SendMailService } from '../mailer';
import { OrderSchema } from './schema/order.schema';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { AuthModule } from '../auth/auth.module';
import { ContactSchema } from './schema/contact.schema';
import { ReviewSchema } from 'src/admin/schema/products.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Order', schema: OrderSchema },
      { name: 'Contact', schema: ContactSchema },
      { name: 'Review', schema: ReviewSchema },
    ]),
  ],
  controllers: [UsersController, MeController],
  providers: [UsersService, MeService, SendMailService, SendMailService]
})
export class UsersModule {}
