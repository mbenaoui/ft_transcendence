import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { FriendsService } from 'src/friends/friends.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, PrismaService,FriendsService ,ChatGateway]
})
export class ChatModule { }