import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { StringValue } from 'ms';
import { JwtStrategy } from './strategies/jwt.strategy';


@Module({
  
  controllers: [AuthController],

  providers: [AuthService,JwtStrategy],

  imports: [
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN') as StringValue,
        },
      })
    }),

    UsersModule,
  ],

  exports:[JwtModule,PassportModule]

})
export class AuthModule { }
