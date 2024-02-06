import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { playDto, roomDto } from '../dto/game';

@Injectable()
export class RoomService {
  constructor(private readonly prisma: PrismaService) { }

  async getRoom(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }
  async creatRoom(userId: number, body: roomDto) {
    let status;

    const existingFriendship = await this.prisma.friendRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: Number(body.opponentId),
      },
    });
    const existingFriendship1 = await this.prisma.friendRequest.findFirst({
      where: {
        senderId: Number(body.opponentId),
        receiverId: userId,
      },
    });
    if (existingFriendship)
      status = existingFriendship.status
    if(existingFriendship1)
      existingFriendship1.status

    if (status != 'blocked') {

      const data = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          room: body.room,
          opponentId: Number(body.opponentId),
        },
      });
      return data;
    }
  }
  async choiseSettingGame(userId: number, body: playDto) {
    const data = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        gameStatus: body.gameStatus
      },
    });
    return data;
  }
  async startGame(userId: number, body: playDto) {
    const data = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        gameStatus: body.gameStatus
      },
    });
    return data;
  }
  async deleteRoom(userId: number) {
    const data = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        room: '',
        opponentId: 0,
        isOnline: false,
        gameStatus: ''
      },
    });
    return data;
  }
}
