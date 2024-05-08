import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-strategy';
import { UserSchema } from '../users/schema/user.schema';
import { AdminSchema } from '../admin/schema/admin.schema';

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
      })
    ],
    providers: [JwtStrategy, { provide: 'UserModel', useFactory: () => UserSchema }, { provide: 'AdminModel', useFactory: () => AdminSchema }],
    exports: [JwtStrategy, PassportModule], 
})
export class AuthModule {}
