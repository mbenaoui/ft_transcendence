import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AchievementDto } from '../dto/game';
// import { roomDto } from '../dto/game';

@Injectable()
export class AchievementService {
  constructor(private readonly prisma: PrismaService) { }

  async updateLevel(userId: number, body: AchievementDto) {
    let newLevel: number = 0
    let ifWon = 0
    let ifLost = 0
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      }
    });
    if (body.status == 'won')
      ifWon = 1
    if (body.status == 'lost')
      ifLost = 1

    if (!user.won)
      user.won = 0
    if (!user.lost)
      user.lost = 0

    if (user.level < 5)
      newLevel = body.points / 100

    else if (user.level < 7)
      newLevel = body.points / 200

    else if (user.level < 10)
      newLevel = body.points / 250
    const userr = await this.prisma.user.update({
      where: {
        id: userId,
      }, 
      data: {
        level: user.level + newLevel,
        won: user.won + ifWon,
        lost: user.lost + ifLost,
      },
    });
  }

}
