import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient, Prisma, User } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';
import { Response, Request, response } from 'express';
import * as speakeasy from 'speakeasy';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { JwtPayload } from './jwt/jwt-payload.interface';
import { UserService } from 'src/user/user.service';
import { authenticator } from 'otplib';
import { Constant } from 'src/constants/constant';

@Injectable()
export class AuthService {
  [x: string]: any;
  constructor(
    private readonly prisma: PrismaClient,
    private userService: UserService,
    private jwtService: JwtService,
  ) { }
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async findOne(condition: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.findUnique({
      where: condition,
    });
  }


  async setTwoFactor(id: string, code: string): Promise<any> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: Number(id),
        },
      });
      if (!user || !user.tempSecret) {
        throw new NotFoundException('User or tempSecret not found');
      }

      const verified = authenticator.check(code, user.tempSecret);

      if (!verified) {
        throw new NotFoundException('Invalid 2FA code');
      }
      await this.prisma.user.update({
        where: {
          id: Number(id),
        },
        data: {
          isTwoFactorEnabled: true,
          twoFactorSecret: user.tempSecret,
        },

      });
      return user;
    } catch (error) {
      throw new NotFoundException('Unable to set two-factor authentication');
    }
  }
  async verifyTwoFactor(dto: AuthDto): Promise<any> {
    
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if 2FA is enabled for the user
    if (!user.twoFactorSecret) {
      throw new ForbiddenException('Two-Factor Authentication is not enabled for this user');
    }

    const verified = authenticator.check(dto.twoFactorSecret, user.twoFactorSecret);


    if (!verified) {
      throw new ForbiddenException('Invalid Two-Factor Authentication code');
    }

    // If 2FA code is valid, return the user
    return user;
  }
  async verifyTwoFactor_intra(dto: AuthDto): Promise<any> {
    // Assuming you use some form of authentication and the user object is attached to the request
    const user = await this.prisma.user.findUnique({
      where: {
        id: Number(dto.foto_user),
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if 2FA is enabled for the user
    if (!user.twoFactorSecret) {
      throw new ForbiddenException('Two-Factor Authentication is not enabled for this user');
    }
    const verified = authenticator.check(dto.twoFactorSecret, user.twoFactorSecret);




    if (!verified) {
      throw new ForbiddenException('Invalid Two-Factor Authentication code');
    }

    return user;
  }
  async validateUser(payload: JwtPayload): Promise<User | null> {
    return await this.userService.findByUserId(payload.id);
  }
  async signup(dto: AuthDto) {
    if (dto.foto_user === 'male')
      dto.foto_user = '/search/boy.png';
    else
      dto.foto_user = '/search/woman.png';
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          username: dto.username, // Replace with the desired username
          lastName: dto.lastName, // Replace with the user's last name
          isOnline: false,
          won: 0,
          lost: 0,
          level: 0,
          first_login: true,
          foto_user: dto.foto_user,
          twoFactorSecret: null,
          hash,
        },
      });
      delete user.hash;
      //return the saved user
      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw e;
    }
  }

  async signin(dto: AuthDto) {
    // return {msg: 'I have signed in'}
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) throw new ForbiddenException('Credentials taken');
    //compare password
    const pwMathes = await argon.verify(user.hash, dto.password);
    //if password incorrect throw expception
    if (!pwMathes) throw new ForbiddenException('Credentials taken');
    delete user.hash;

    return user;
  }
  async login(requser) {
    try {
    
      
      const user = await this.prisma.user.findUnique({
        where: {
          email: requser.email,
        },
      });
      if (user) return user;
      // const ifusernameExist = await this.prisma.user.findUnique({
      //   where: {
      //     username: requser.username,
      //   },
      // });

      
  const user1 = await this.prisma.user.create({
    data: {
      email: requser.email,
      // createdAt: new Date(),
      username: requser.username, // Replace with the desired username
      lastName: requser.lastName, // Replace with the user's last name
      firstName: requser.firstName,
      isOnline: false,
      foto_user: requser.avatar,
      won: 0,
      lost: 0,
      level: 0,
      first_login: true,
      hash: '', // Replace with the actual password hash
    },
  });

  return user1;
} catch (e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2002') {
      throw new ForbiddenException('Credentials taken');
    }
  }
  throw e;
}
  }
}
