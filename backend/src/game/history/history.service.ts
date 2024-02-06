import { Injectable } from '@nestjs/common';
import { historyDto } from '../dto/game';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class HistoryService {
  constructor(private readonly prisma: PrismaService) { }

  async updateUsershistory(userid: Number, body: historyDto) {
    try {
      await this.prisma.history.create({
        data: {
          myGools: Number(body.myGools),
          opponentGools: Number(body.opponentGools),
          status: body.status,
          opponentId: Number(body.opponentId),

          user: {
            connect: {
              id: Number(userid),
            },
          },
        },
      });
    } catch (error) {
    }
  }

  async getUsershistory(userid: number) {
    return await this.prisma.history.findMany({
      where: {
        user: {
          id: userid,
        },
      },
    });
  }

  async getUsersCustomhistory(userid: number, customid: number) {

    return await this.prisma.history.findMany({
      where: {
        user: {
          id: userid,
        },
        opponentId: customid,
      },
    });
  }

  async clearUsershistory(userid: number) {
    return await this.prisma.history.deleteMany({
      where: {
        userId: userid,
      }
    });

  }

  async clearUsersCustomhistory(userid: number, customid: number) {

    return await this.prisma.history.deleteMany({
      where: {
        user: {
          id: userid,
        },
        opponentId: customid,
      },
    });
  }
}
