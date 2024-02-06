import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { UserService } from 'src/user/user.service';
import { RoomService } from './room/room.service';
import { RoomController } from './room/room.controller';
import { RoomModule } from './room/room.module';
import { AchievementModule } from './achievement/achievement.module';
import { AchievementController } from './achievement/achievement.controller';
import { AchievementService } from './achievement/achievement.service';
import { HistoryService } from './history/history.service';
import { HistoryModule } from './history/history.module';
import { HistoryController } from './history/history.controller'; 

@Module({
  controllers: [HistoryController, GameController, RoomController, AchievementController],
  providers: [
    GameService,
    GameGateway,
    UserService,
    RoomService,
    HistoryService,
    AchievementService

  ],
  imports: [HistoryModule, RoomModule, AchievementModule],
})
export class GameModule { }
