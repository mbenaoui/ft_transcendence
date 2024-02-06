import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // You should have a Prisma service
import { User } from '@prisma/client';
import { toDataURL } from 'qrcode'
import { authenticator } from 'otplib';
import { TwoFactorAuthService } from './TwoFactorAuthService';


@Injectable()
export class UserService {
  twoFactorAuthService: TwoFactorAuthService;
  constructor(private prisma: PrismaService) { }

  async findByUserId(id: number): Promise<User | undefined> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  }
  async makeUserInGame(id: number) {
    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        isOnline: true,
      }
    });
  }

  async findAllUsers(userAId: number) {
    const users = await this.prisma.user.findMany();
    const filteredUsers = users.filter(user => user.id !== userAId);
    return filteredUsers;
  }
  async findAautherUsers(userAId: number) {
    
    const users = await this.prisma.user.findMany();
    const data_rese = await this.prisma.user.findUnique({
      where: { id: userAId },
      include: {
        sentFriendRequests: {
          where: {
            OR: [
              { status: "pending" },
              { status: "accepted" },
              { status: "blocked" },
            ],
          },
          select: {
            id: false,
            status: false,
            receiver: {
              select: {
                id: true,
                username: true,
                foto_user: true,
              },
            },
          },
        },
        receivedFriendRequests: {
          where: {
            OR: [
              { status: "pending" },
              { status: "accepted" },
              { status: "blocked" },
            ],
          },
          select: {
            id: false,
            status: false,
            sender: {
              select: {
                id: true,
                username: true,
                foto_user: true,
              },
            },
          },
        },
      },
    });

    const filteredUsers = users.filter(user => user.id !== userAId);
    const filteredUsers1 = filteredUsers.filter(user => {
      const hasMatchingSentRequest = data_rese.sentFriendRequests.some(
        sentRequest => sentRequest.receiver.id === user.id
      );
      return !hasMatchingSentRequest;
    });

    const filteredUsers2 = filteredUsers1.filter(user => {
      const hasMatchingReceivedRequest = data_rese.receivedFriendRequests.some(
        receivedRequest => receivedRequest.sender.id === user.id
      );
      return !hasMatchingReceivedRequest;
    });
    return filteredUsers2;
  }
  async findOneUsers(userAId: number, userName: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userAId,
        username: userName
      }
    });
    if (!user) {

      throw new UnauthorizedException();
    }
    return user;
  }
  async apdate_user(userAId: number, userName: string, foto_user: string, email: string) {
    if (userName.length > 15) {
      userName = userName.substring(0, 15);
    }

    const user = await this.prisma.user.update({
      where: {
        id: userAId,
      },
      data: {
        username: userName,
        email: email,
        foto_user: foto_user
      },
    });
  }
  async enableTwoFactor(userId: number): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    const secret = authenticator.generateSecret();
    const uri = authenticator.keyuri(user.username, '2FA Tutorial', secret);
    const image = toDataURL(uri);

    await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        tempSecret: secret
      },
    });
    return uri;
  }
  async DeactivateTwoFactor(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        twoFactorSecret: null
      },
    });
  }
  async FirstTime(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        first_login: false
      },
    });
  }
}