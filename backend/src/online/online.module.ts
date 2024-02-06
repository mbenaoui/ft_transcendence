import { Module } from '@nestjs/common';
import { OnlineController } from './online.controller';
import { OnlineService } from './online.service';
import { OnlineGateway } from './online.gateway';
import { JwtService } from '@nestjs/jwt';
import { FriendsService } from 'src/friends/friends.service';
import { ChatService } from 'src/chat/chat.service';

@Module({
  controllers: [OnlineController],
  providers: [OnlineService, OnlineGateway, JwtService,FriendsService,ChatService],
})
export class OnlineModule { }
