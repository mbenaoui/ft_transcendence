import { Module } from '@nestjs/common';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [HistoryService, UserService],
  controllers: [HistoryController]
})
export class HistoryModule { }
