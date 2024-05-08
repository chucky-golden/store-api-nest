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
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Order', schema: OrderSchema },
    ])
  ],
  controllers: [UsersController, MeController],
  providers: [UsersService, MeService, SendMailService, SendMailService, JwtService]
})
export class UsersModule {}
