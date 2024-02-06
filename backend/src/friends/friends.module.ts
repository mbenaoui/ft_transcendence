// src/friends/friends.module.ts

import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { ChatService } from 'src/chat/chat.service';

@Module({
  controllers:[FriendsController],
  providers: [FriendsService,ChatService],
})
export class FriendsModule {}
