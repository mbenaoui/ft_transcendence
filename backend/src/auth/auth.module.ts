import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { FortyTwoStrategy } from './42.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { JwtStrategy } from './jwt/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    PassportModule.register({ defaultStrategy: '42' }),
  ],
  controllers: [AuthController],
  providers: [AuthService,UserService,JwtStrategy,FortyTwoStrategy,PrismaClient],
})
export class AuthModule {}
