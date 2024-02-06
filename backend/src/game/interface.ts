export class BALL {
    acceLeration: number;
    velocityX: number;
    velocityY: number;
    status: string
    bottom: number;
    raduis: number;
    speeD: number;
    right: number;
    ballX: number
    ballY: number
    left: number;
    top: number;
    public constructor({ ballX, ballY, velocityX, velocityY, acceLeration, speeD, raduis }) {
        this.acceLeration = acceLeration
        this.velocityX = velocityX
        this.velocityY = velocityY
        this.raduis = raduis
        this.ballX = ballX
        this.ballY = ballY
        this.speeD = speeD
        this.bottom = 0
        this.right = 0
        this.left = 0
        this.top = 0
    }
}

export class Game {
    gameFinish: boolean
    player1_Id: number
    player2_Id: number
    proteted: boolean
    replay: boolean
    player1: Player
    player2: Player
    status: string
    canvas: Canvas
    score: number
    gameId: any
    Ball: BALL
}
export class Canvas {
    velocityX: number
    velocityY: number
    height: number
    speeD: number
    width: number
    public constructor({ width, height, velocityX, velocityY, speeD }) {
        this.velocityX = velocityX
        this.velocityY = velocityY
        this.height = height
        this.speeD = speeD
        this.width = width
    }
}

export class Player {
    points: number
    pause: boolean
    bottom: number;
    status: string;
    height: number;
    width: number
    score: number;
    right: number;
    name: string
    left: number;
    top: number;
    x: number;
    y: number;
    public constructor(x: number, y: number, width: number, height: number, name: string) {
        this.height = height
        this.width = width
        this.name = name
        this.status = ''
        this.score = 0
        this.points = 0
        this.x = x;
        this.y = y;
        this.pause = false
    }
}
