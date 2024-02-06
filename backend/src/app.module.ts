
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { FriendsModule } from './friends/friends.module';
import { JwtModule } from '@nestjs/jwt';
import { GameGateway } from './game/game.gateway';
import { UserService } from './user/user.service';
import { json } from 'express';
import { GameModule } from './game/game.module';
import { OnlineModule } from './online/online.module';
import { RoomService } from './game/room/room.service';
import { JwtAuthGuard } from './auth/jwt/jwt-auth.guard';
import { JwtMiddleware } from './auth/jwt/jwt.middleware';
import { ChatModule } from './chat/chat.module';
import { RecentModule } from './search/recent.module';



@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET, 
            signOptions: { expiresIn: '1h' }, 
        }),
        ConfigModule.forRoot({
            isGlobal: true
        }), AuthModule, UserModule, PrismaModule, FriendsModule, GameModule, ChatModule, OnlineModule, RecentModule],
    providers: [],

})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(json({ limit: '10mb' })).forRoutes('*');
        consumer
            .apply(JwtMiddleware)

            .forRoutes(
                { path: '*', method: RequestMethod.ALL }, 
            );
    }
}