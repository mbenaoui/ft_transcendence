import { GameInfoProps } from "./computer";

export class Player {
    youWonRrLost: string = "";
    status: string = "Pause";
    opponentId: number = -5;
    color: string = "red";
    height: number = 100;
    width: number = 10;
    score: number = 0;
    bottom: number = 0;
    right: number = 0;
    name: string = "";
    left: number = 0;
    top: number = 0;
    x: number = 0;
    y: number = 0;
    id: number = -6;

    public constructor(x: number, y: number, widht: number, height: number, color: string) {
        this.y = y;
        this.width = widht
        this.height = height
        this.x = x;
        this.color = color
    }
    public setBorder(): void {
        this.bottom = this.y + this.height;
        this.right = this.x + this.width;
        this.left = this.x;
        this.top = this.y;
    }
}


export class Ball {
    velocityX: number = 0;
    velocityY: number = 0;
    radiusX: number = 0;
    radiusY: number = 0;
    bottom: number = 0;
    right: number = 0;
    left: number = 0;
    top: number = 0;
    raduis: number;
    color: string;
    x: number = 0;
    y: number = 0;
    speed: number;
    Gameinfo: any
    public constructor(x: number, y: number, gameInfo: GameInfoProps) {
        this.velocityX = gameInfo.VELOCIT * -1;
        this.raduis = gameInfo.RADIUS_BALL;
        this.velocityY = gameInfo.VELOCIT;
        this.color = gameInfo.THE_BALL;
        this.speed = gameInfo.SPEED;
        this.Gameinfo = gameInfo
        this.x = x;
        this.y = y;
    }
    public setBorder(): void {
        this.bottom = this.y + this.raduis;
        this.right = this.x + this.raduis;
        this.left = this.x - this.raduis;
        this.top = this.y - this.raduis;
    }
    public checkCollision(selectPlayer: Player): boolean {
        return (
            this.bottom > selectPlayer.top &&
            this.top < selectPlayer.bottom &&
            this.right > selectPlayer.left &&
            this.left < selectPlayer.right
        );
    }
}


export class Canvas {
    ctx: CanvasRenderingContext2D | null;
    canvas: HTMLCanvasElement;
    flag: number = 0;
    height: number;
    width: number;
    gameInfo: GameInfoProps

    public constructor(canvas: HTMLCanvasElement, GameInfo: GameInfoProps) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.height = canvas.height;
        this.width = canvas.width;
        this.gameInfo = GameInfo
    }
    public ClearCanvas(): void {
        if (!this.ctx) return;
        this.ctx.fillStyle = this.gameInfo.CANVAS_COLOR
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // var img = new Image();
        // img.src = '/ping-pong.png';
        // this.ctx.drawImage(img, 0, -50, this.canvas.width, this.canvas.height + 100);
    }
    public drawRect(object: Player): void {
        if (!this.ctx) return;
        this.ctx.fillStyle = object.color;
        this.ctx.fillRect(object.x, object.y, object.width, object.height);
    }
    public drawTheBall(ball: Ball): void {
        if (!this.ctx) return;
        // this.ctx.fillStyle = 'black';
        // this.ctx.beginPath();
        // this.ctx.arc(ball.x, ball.y, ball.raduis, 0, Math.PI * 2, true);
        // this.ctx.closePath();
        // this.ctx.fill();
        
        var img = new Image();
        img.src = ball.color;
        this.ctx.drawImage(img, ball.x - ball.radiusX, ball.y - ball.radiusY, ball.radiusX * 2, ball.radiusY * 2);
    }

    public drawText(text: string, x: number, y: number, color: string) {
        if (!this.ctx) return;
        this.ctx.fillStyle = color;
        this.ctx.font = "40px fantasy";
        this.ctx.fillText(text, x, y);
    }

    public drawMedianLine(lineInfo: { w: number; h: number; step: number; color: string }): void {
        if (!this.ctx) return;
        for (let i = 0; i < this.height; i += lineInfo.step) {
            this.ctx.fillStyle = lineInfo.color;
            this.ctx.fillRect(
                this.width / 2 - lineInfo.w / 2,
                i,
                lineInfo.w,
                lineInfo.h
            );
        }
    }
    public moveBallWenCollision(ball: Ball, selectPlayer: Player): void {
        {
            let whenCollision =
                (ball.y - (selectPlayer.y + selectPlayer.height / 2)) /
                (selectPlayer.height / 2);
            const direction = ball.x > this.width / 2 ? -1 : 1;
            let newAngle = this.gameInfo.ANGLE * whenCollision;
            ball.velocityX = direction * ball.speed * Math.cos(newAngle);
            ball.velocityY = ball.speed * Math.sin(newAngle);
            ball.speed += this.gameInfo.ACCELERATION;
        }
    }
}
