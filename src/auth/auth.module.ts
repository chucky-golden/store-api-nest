import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt-strategy';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { Admin, AdminSchema } from 'src/admin/schema/admin.schema';

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
        { name: User.name, schema: UserSchema },
        { name: Admin.name, schema: AdminSchema },
    ]),
  ],
  controllers: [],
  providers: [JwtStrategy],
  exports: [JwtModule, JwtStrategy, PassportModule], // here we wxport module we want to use outside this app
})
export class AuthModule {}
