import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { SendMailService } from '../mailer';
import { OrderSchema } from './schema/order.schema';
import { JwtStrategy } from './jwt-strategy';
import { MeService } from './me.service';
import { MeController } from './me.controller';

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
      { name: 'User', schema: UserSchema },
      { name: 'Order', schema: OrderSchema },
    ])
  ],
  controllers: [UsersController, MeController],
  providers: [UsersService, MeService, SendMailService, SendMailService, JwtStrategy, PassportModule]
})
export class UsersModule {}
