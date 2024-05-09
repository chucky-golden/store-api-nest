import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy';
import { User, UserSchema } from 'src/users/schema/user.schema';
import { Admin, AdminSchema } from 'src/admin/schema/admin.schema';
import { AuthService } from './auth.service';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRE }, // Adjust expiration as needed
    }),

    MongooseModule.forFeature([
        { name: User.name, schema: UserSchema },
        { name: Admin.name, schema: AdminSchema },
    ]),
  ],
  controllers: [],
  providers: [AuthService, JwtStrategy, JwtService],
  exports: [AuthService, PassportModule, JwtService], // here we wxport module we want to use outside this app
})
export class AuthModule {}
