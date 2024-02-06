import { Body, Controller, Delete, Get, Param, Req, Post } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementDto } from '../dto/game';

@Controller('game/achievement')
export class AchievementController {
  constructor(private readonly AchievementService: AchievementService) { }
  @Post()
  async updateLevel(@Req() req: Request, @Body() body: AchievementDto) {
    try {
      return this.AchievementService.updateLevel(Number(req['id']), body);
    } catch (error) {
    }
  }
}
