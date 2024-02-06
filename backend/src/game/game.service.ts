
// game.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BALL, Canvas, Game, Player } from './interface';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class GameService {
    startGame(game: Game): void {

    }
    updateGame({ game, room, server }: { game: Game, room: string, server: Server }): void {

        this.setBallBorder({ game: game })
        this.setPlayerBorder({ game: game, })
        this.setPlayerBorder({ game: game })


        if (game.Ball.right < 0) {
            const velocityX = Math.floor(Math.random() * 2) ? -1 : 1
            const velocityY = Math.floor(Math.random() * 2) ? -1 : 1
            game.player1.score += 1
            game.Ball.ballX = game.canvas.width / 2;
            game.Ball.ballY = Math.floor(Math.random() * 350) + 50;
            game.Ball.velocityX = game.canvas.velocityX * velocityX;
            game.Ball.velocityY = game.canvas.velocityY * velocityY;
            game.Ball.speeD = game.canvas.speeD
        }
        if (game.Ball.left > game.canvas.width) {
            const velocityX = Math.floor(Math.random() * 2) ? -1 : 1
            const velocityY = Math.floor(Math.random() * 2) ? -1 : 1
            game.player2.score += 1
            game.Ball.ballX = game.canvas.width / 2;
            game.Ball.ballY = Math.floor(Math.random() * 350) + 50;
            game.Ball.velocityX = game.canvas.velocityX * velocityX;
            game.Ball.velocityY = game.canvas.velocityY * velocityY;
            game.Ball.speeD = game.canvas.speeD
        }
        if (game.Ball.bottom > game.canvas.height || game.Ball.top < 0)
            game.Ball.velocityY *= -1;
        if (game.Ball.top < -2)
            game.Ball.ballY += 5
        if (game.Ball.bottom > game.canvas.height + 2)
            game.Ball.ballY -= 5
        let selectPlayerCollision = game.Ball.ballX < game.canvas.width / 2 ? game.player1 : game.player2;
        if (this.checkCollision({ game: game, selectPlayerCollision: selectPlayerCollision })) {
            const Angle = Math.PI / 6
            const whenCollision =
                (game.Ball.ballY - (selectPlayerCollision.y + selectPlayerCollision.height / 2)) /
                (selectPlayerCollision.height / 2);
            const direction = game.Ball.ballX > game.canvas.width / 2 ? -1 : 1;
            const newAngle = Angle * whenCollision;
            game.Ball.velocityX = direction * game.Ball.speeD * Math.cos(newAngle);
            game.Ball.velocityY = game.Ball.speeD * Math.sin(newAngle);
            game.Ball.speeD += game.Ball.acceLeration
        }
        game.Ball.ballX += game.Ball.velocityX;
        game.Ball.ballY += game.Ball.velocityY;
    }

    setBallBorder({ game }: { game: Game }): void {
        game.Ball.bottom = game.Ball.ballY + game.Ball.raduis;
        game.Ball.right = game.Ball.ballX + game.Ball.raduis;
        game.Ball.left = game.Ball.ballX - game.Ball.raduis;
        game.Ball.top = game.Ball.ballY - game.Ball.raduis;
    }
    setPlayerBorder({ game }: { game: Game }): void {
        game.player1.bottom = game.player1.y + game.player1.height;
        game.player1.right = game.player1.x + game.player1.width;
        game.player1.left = game.player1.x;
        game.player1.top = game.player1.y;

        game.player2.bottom = game.player2.y + game.player2.height;
        game.player2.right = game.player2.x + game.player2.width;
        game.player2.left = game.player2.x;
        game.player2.top = game.player2.y;
    }
    checkCollision({ game, selectPlayerCollision }: { game: Game, selectPlayerCollision: Player }): boolean {
        return (
            game.Ball.bottom > selectPlayerCollision.top &&
            game.Ball.top < selectPlayerCollision.bottom &&
            game.Ball.right > selectPlayerCollision.left &&
            game.Ball.left < selectPlayerCollision.right
        );
    }
    checkIfgameOver({ game }: { game: Game }) {
        if (game.player1.score == game.score) {
            game.player1.status = 'won'
            game.player2.status = 'lost'
            game.status = 'Pause'
        }
        if (game.player2.score == game.score) {
            game.player2.status = 'won'
            game.player1.status = 'lost'
            game.status = 'Pause'
        }
        if (game.player1.status == 'won') {
            game.player1.points = game.player1.score * 20 - game.player2.score * 5
            game.player2.points = game.player2.points == 0 ? 5 : game.player2.score * 10
        }
        if (game.player2.status == 'won') {
            game.player2.points = game.player2.score * 20 - game.player1.score * 5
            game.player1.points = game.player1.points == 0 ? 10 : game.player1.score * 10
        }
    }
    async checkuserIfAuth(tokens: string) {
        if (!tokens) {
            throw new UnauthorizedException('JWT token is missing.');
        }
        const decodedToken = await jwt.verify(tokens, process.env.JWT_SECRET);
        if (!decodedToken) {
            throw new UnauthorizedException('JWT token is invalid.');
        }
        return {
            id: decodedToken['id']
        }
    }
}
