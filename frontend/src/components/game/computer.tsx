
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Ball, Canvas, Player } from "./class";
import Image from "next/image";
import { userProps } from "@/interface/data";
import { ScoreBoard } from "./online";

export interface InfoGameprops {
    currentUser: userProps
    setselectPlayer: (selectPlayer: string) => void;
    selectPlayer: string;
    canvasTheme: string
    ballTheme: string
    gameLevel: string
}
export interface GameInfoProps {
    BALL_START_SPEED: number,
    PLAYER_HEIGHT: Number,
    CANVAS_HIEGHT: number,
    PLAYER_COLOR: string,
    CANVAS_WIDTH: number,
    ACCELERATION: number,
    CANVAS_COLOR: string,
    PLAYER_WIDTH: number,
    MEDIANLINE: string,
    RADIUS_BALL: number,
    THE_BALL: string,
    PLAYER_X: number,
    PLAYER_Y: number,
    VELOCIT: number,
    LEVEL: number,
    ANGLE: number,
    SPEED: number,
    FPS: Number,
}
export interface startGameProps {
    myCanvasRef: React.RefObject<HTMLCanvasElement>;
    mousePosition: { x: number; y: number };
    selectPlayer: string;
    computer: Player;
    player: Player;
    GameInfo: any;
    ball: Ball;
}


function LinearInterpolation(pos1: number, pos2: number, t: number) {
    return pos1 + (pos2 - pos1) * t;
}

const updateGameLoop = (MyCanvas: Canvas, mousePosition: { x: number; y: number }, ball: Ball, player: Player, computer: Player, selectPlayer: string, GameInfo: any) => {

    if (selectPlayer === "computer") {
        const newY = LinearInterpolation(computer.y, ball.y - computer.height / 2, GameInfo.LEVEL);
        if (newY > -10 && (newY + computer.height < GameInfo.CANVAS_HIEGHT + 10))
            computer.y = newY;
    }
    else {
        if (mousePosition.x > -10 && (mousePosition.x + computer.height < GameInfo.CANVAS_HIEGHT + 10))
            computer.y = mousePosition.x;
    }

    if (mousePosition.y > -0 && (mousePosition.y + player.height < GameInfo.CANVAS_HIEGHT + 0))
        player.y = mousePosition.y;
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    ball.setBorder();
    player.setBorder();
    computer.setBorder();
    if (ball.bottom + 2 > GameInfo.CANVAS_HIEGHT || ball.top - 2 < 0)
        ball.velocityY *= -1;
    if (ball.top < -2)
        ball.y += 5
    if (ball.bottom > MyCanvas.height + 2)
        ball.y -= 5
    let selectPlayerCollision = ball.x < GameInfo.CANVAS_WIDTH / 2 ? player : computer;
    if (ball.checkCollision(selectPlayerCollision))
        MyCanvas.moveBallWenCollision(ball, selectPlayerCollision);
};

const renderGameOverScreen = (MyCanvas: Canvas, ball: Ball, player: Player, computer: Player) => {
    MyCanvas.ClearCanvas();
    MyCanvas.drawMedianLine({ w: 2, h: 10, step: 20, color: MyCanvas.gameInfo.MEDIANLINE });
    MyCanvas.drawTheBall(ball);
    MyCanvas.drawRect(player);
    MyCanvas.drawRect(computer);
};

function startGame({ myCanvasRef, mousePosition, ball, player, computer, selectPlayer, GameInfo }: startGameProps) {
    if (!myCanvasRef.current) return;
    const MyCanvas = new Canvas(myCanvasRef.current, GameInfo);
    computer.x = GameInfo.CANVAS_WIDTH - GameInfo.PLAYER_WIDTH - 15
    if (computer.status == 'Resume' || player.status == 'Resume')
        return
    updateGameLoop(MyCanvas, mousePosition, ball, player, computer, selectPlayer, GameInfo);
    renderGameOverScreen(MyCanvas, ball, player, computer);
}

const PlayWithComputer = ({ currentUser, selectPlayer, setselectPlayer, ballTheme, canvasTheme, gameLevel }: InfoGameprops) => {

    let level: number = 0.14
    if (gameLevel == 'easy')
        level = 0.14
    if (gameLevel == 'medium')
        level = 0.25
    if (gameLevel == 'hard')
        level = 0.40

    const GameInfo = {
        FPS: 1000 / 60,
        PLAYER_COLOR: canvasTheme == "white" ? 'black' : 'white',
        PLAYER_HEIGHT: 100,
        PLAYER_WIDTH: 15,
        PLAYER_X: 15,
        PLAYER_Y: 0,

        THE_BALL: ballTheme,
        BALL_START_SPEED: 2,
        ANGLE: Math.PI / 6,
        RADIUS_BALL: 15,
        ACCELERATION: 0.3,
        LEVEL: level,
        VELOCIT: 8,
        SPEED: 10,
        RIGHT_PADDEL: canvasTheme == 'canva1' ? "#35d399" : canvasTheme == 'canva2' ? '#f2f3f5' : '#070D37',
        LEFT_PADDEL: canvasTheme == 'canva1' ? "#fb7185" : canvasTheme == 'canva2' ? '#f2f3f5' : '#070D37',
        CANVAS_COLOR: canvasTheme == 'canva1' ? "#f2f3f5" : canvasTheme == 'canva2' ? '#1f1a1b' : '#548bf8',
        MEDIANLINE: canvasTheme == 'canva1' ? "black" : canvasTheme == 'white' ? '#f2f3f5' : 'white',
        CANVAS_HIEGHT: 450,
        CANVAS_WIDTH: 900,
    };


    const [player] = useState(new Player(GameInfo.PLAYER_X, GameInfo.PLAYER_Y, GameInfo.PLAYER_WIDTH, GameInfo.PLAYER_HEIGHT, GameInfo.LEFT_PADDEL));
    const [computer] = useState(new Player(0, 0, GameInfo.PLAYER_WIDTH, GameInfo.PLAYER_HEIGHT, GameInfo.RIGHT_PADDEL));
    const [ball] = useState(new Ball(GameInfo.CANVAS_WIDTH / 2, GameInfo.CANVAS_HIEGHT / 2, GameInfo));
    const [mousePosition] = useState({ x: 0, y: 0 });
    const YouWonOrLostPlayAgain = useRef("");
    const [pause, setPause] = useState(false)
    const myCanvasRef = useRef<HTMLCanvasElement>(null);
    const router = useRouter();
    const [gameStatus, setgameStatus] = useState({ player1Score: 0, player2Score: 0, yourStatus: '', yourPoints: 0 })
    const [pointCard, setPointCard] = useState(true)
    const [gameStart, setGameStart] = useState(false)

    const windowWidth = useRef(window.innerWidth)
    useEffect(() => {
        if (window.innerWidth < 1500)
            ball.radiusX = 15 + (15 - 15 * (window.innerWidth / 1500))
        else
            ball.radiusX = 17
        ball.radiusY = 15
        const handleRisize = () => {
            if (window.innerWidth < 1500) {
                ball.radiusX = 15 + (15 - 15 * (window.innerWidth / 1500))
            }
        }
        window.addEventListener('resize', handleRisize);
        return () => {
            window.removeEventListener('resize', handleRisize);
        };

    }, [])
    useEffect(() => {
        setTimeout(() => {
            setGameStart(true)
            const intervalId = setInterval(() => {
                if (computer.status == 'Resume' || player.status == 'Resume' || player.youWonRrLost != "")
                    return
                startGame({ myCanvasRef, mousePosition, ball, player, computer, selectPlayer, GameInfo });
                if (ball.right < 0) {
                    computer.score += 1;
                    ball.x = GameInfo.CANVAS_WIDTH / 2;
                    ball.y = GameInfo.CANVAS_HIEGHT / 3;
                    ball.velocityX = GameInfo.VELOCIT;
                    GameInfo.VELOCIT *= -1
                    ball.velocityY = Math.abs(GameInfo.VELOCIT);
                    ball.speed = GameInfo.SPEED
                }
                if (ball.left > GameInfo.CANVAS_WIDTH) {
                    player.score += 1;
                    ball.x = GameInfo.CANVAS_WIDTH / 2;
                    ball.y = GameInfo.CANVAS_HIEGHT / 3;
                    ball.velocityX = GameInfo.VELOCIT;
                    GameInfo.VELOCIT *= -1
                    ball.velocityY = Math.abs(GameInfo.VELOCIT);
                    ball.speed = GameInfo.SPEED
                }
                if (player.score >= 3) {
                    player.youWonRrLost = "won"
                }
                if (computer.score >= 3) {
                    player.youWonRrLost = "lost"
                }
                const points = player.youWonRrLost == "won" ? 60 - computer.score * 5 : 10 + player.score * 5
                setgameStatus({ player2Score: player.score, player1Score: computer.score, yourStatus: player.youWonRrLost, yourPoints: points })
            }, GameInfo.FPS);
        }, 5000);
        return () => {
            // remove intervalId
        }
    }, []);

    const handleMouseMove = (e: any) => {
        const rect = e.target.getBoundingClientRect();
        mousePosition.y = e.clientY - rect.top - 50;
    };

    const handelButtonGameStatus = () => {
        if (gameStatus.yourStatus != '')
            return
        setPause((pr) => !pr)
        const status = player.status === 'Pause' ? 'Resume' : 'Pause'
        player.status = status
    }

    const handelButtonPlayAgain = () => {
        setPointCard(true)
        setGameStart(false)
        setgameStatus({ player1Score: 0, player2Score: 0, yourStatus: '', yourPoints: 0 })

        setTimeout(() => {
            computer.score = 0
            ball.velocityX = -GameInfo.VELOCIT;
            ball.velocityY = GameInfo.VELOCIT;
            YouWonOrLostPlayAgain.current = ""
            computer.youWonRrLost = ""
            player.youWonRrLost = ""
            player.score = 0
            ball.x = GameInfo.CANVAS_WIDTH / 2;
            ball.y = GameInfo.CANVAS_HIEGHT / 2;
            setGameStart(true)

        }, 5000);
    }

    return (
        <div className="Gamebackground   w-full h-screen flex  justify-center   ">
            <div className=" relative w-full  max-w-[1700px] h-[800px] flex flex-col  justify-center items-center  mt-[70px]">
                <ScoreBoard currentUser={currentUser} direction="right" pause={pause} handelButtonLeave={() => router.push('/game')}
                    handelButtonGameStatus={handelButtonGameStatus} gameStatus={gameStatus} Ai={true} AiProfile="/game/ai.png" />

                <div className=" relative w-full h-[600px] flex justify-center items-center ">
                    <div className={`w-full h-[100%] flex justify-center`}>
                        {gameStart ? (<canvas
                            className={`  border-2 rounded-sm md:rounded-lg w-[99%] h-[70%]   bg-[#0a0a31]   md:w-[70%] 2xl:h-[100%] 2xl:w-[60%] `}
                            ref={myCanvasRef}
                            width={900}
                            height={450}
                            onMouseMove={handleMouseMove}
                        />) :
                            (
                                <GameIsReady username={currentUser.username} opponenetUsername="Ai" userImage={currentUser.foto_user} opponentImage='/game/ai.png' />
                            )
                        }
                    </div>
                    {
                        gameStatus.yourStatus != '' ? (
                            <div className="absolute  w-full h-[100%] flex justify-center " >
                                <div className="border-2 rounded-sm md:rounded-lg w-[99%] h-[70%]     md:w-[70%] 2xl:h-[100%] 2xl:w-[60%] flex justify-center items-center ">
                                    {
                                        pointCard ? (
                                            <div className="w-full h-full  flex justify-center items-center">
                                                <div className=" relative w-[100%] h-[100%] flex justify-center items-center ">
                                                    <Image className=" rounded-2xl  bg-black" width={500} height={0} alt="points" src={gameStatus.yourStatus == 'won' ? '/game/youwon.svg' : '/game/youlost.svg'} />
                                                    <div className=" absolute z-10 w-full h-full bg-red-20  flex flex-col justify-center items-center space-y-0">
                                                        <div className=" relative text-2xl  top-[22px]">
                                                            {
                                                                gameStatus.yourStatus == 'won' ? 'Your Won' : 'Your Lost'
                                                            }
                                                        </div>
                                                        <div className=" relative text-yellow-400 text-base 2xl:text-xl  top-[50px] -right-1">
                                                            +{gameStatus.yourPoints}
                                                        </div>
                                                        <button onClick={() => setPointCard(false)} className=" relative text-yellow-400  2xl:text-3xl  text-xl top-[120px]" >
                                                            Next
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <PlayAgainComp handelExit={() => router.push("/game")} handelReplay={handelButtonPlayAgain} />
                                        )
                                    }
                                </div>
                            </div>
                        ) : null
                    }
                </div>
            </div>
        </div >
    );
};

export default PlayWithComputer;



export const GameIsReady = ({ username, opponenetUsername, userImage, opponentImage }:
    { username: string, opponenetUsername: string, userImage: string, opponentImage: string }) => {
    return (
        < div
            className={`GameIsReady bg-black z-20  overflow-hidden flex  border-2 rounded-sm md:rounded-lg w-[99%] h-[70%]     md:w-[70%] 2xl:h-[100%] 2xl:w-[60%]`}
        >
            <div className=" LeftSide md:w-[44%] w-[40%] h-full    flex justify-center items-end">
                <div id="content" className="w-[80%] h-[90%] rounded-t-full bg-[#00005a] flex flex-col sm:flex-row justify-center items-center sm:space-x-4 p-2">
                    <Image className=" rounded-full" src={userImage} width={60} height={60} alt="userimage"></Image>
                    <div className="text-white text-2xl w-full md:w-auto text-center overflow-hidden whitespace-nowrap overflow-ellipsis
                    ">{username}</div>
                </div>
            </div>
            <div className="md:w-[12%]   w-[20%] h-full    bg-black flex  items-center">
                <div id="middleIcn" className="w-full h-[20%] bg-whit relative flex justify-center items-center ">
                    <Image src={'/game/loading.gif'} alt={"reload"} width={60} height={60} className="" />
                </div>
            </div>
            <div className="RightSide md:w-[44%]  w-[40%] h-full      flex justify-center items-start">
                <div id="content" className="w-[80%] h-[90%] rounded-b-full  bg-slate-500 px-3 pb-3">
                    <div className="w-full h-full bg-black rounded-b-full flex flex-col sm:flex-row justify-center items-center sm:space-x-4 p-2">
                        <Image className=" rounded-full" src={opponentImage} width={60} height={60} alt="userimage"></Image>
                        <div className="text-white text-2xl text-center  w-full md:w-auto overflow-hidden whitespace-nowrap overflow-ellipsis ">{opponenetUsername}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export const PlayAgainComp = ({ roomAvailable, handelExit, handelReplay }: { roomAvailable?: any, handelReplay: any, handelExit: any }) => {
    return (
        <div className=" w-[70%] h-[70%] max-w-[500px]   rounded-2xl    shadow-sm bg-[#FFF] ">
            <div className=" relative h-1/2 bg-[#4C49ED] text-[#FFF] rounded-b-[50%] rounded-t-xl text-[40px] md:text-[60px] flex justify-center items-center">
                GAME OVER
                {
                    roomAvailable != undefined ? (
                        <div className=" absolute w-full h-full p-4 text-lg flex justify-start items-start ">
                            <div className="bg-slate-100 rounded-xl flex items-center justify-start  text-blue-900  space-x-2 px-1">
                                <div className="w-[40px]">
                                    {!roomAvailable ? '1 / 2' : '2 / 2'}
                                </div>
                                <div hidden={!roomAvailable} className="">
                                    <Image src={'/game/check.png'} width={20} height={20} alt="ok"></Image>
                                </div>
                            </div>
                        </div>
                    ) : null
                }
            </div>
            <div className="w-full h-1/2 flex flex-col items-center justify-center -mt-6 space-y-4">
                <div className=" font-semibold  text-2xl md:text-3xl">Play Again</div>
                <div className=" space-x-2 md:space-x-10">
                    <button onClick={handelExit}
                        className="px-4 md:px-8 py-2 text-xl md:text-2xl text-[#4C49ED] rounded-2xl border-[1px] border-[#4C49ED] hover:bg-[#e2dede]">EXIT</button>
                    <button onClick={handelReplay}
                        className={`</div>px-4 md:px-8 py-2 text-xl md:text-2xl  ${roomAvailable == undefined ? 'bg-[#4C49ED]' : !roomAvailable ? 'bg-[#7977ff]' : 'bg-[#4C49ED]'} hover:bg-[#6966ff] text-white  rounded-2xl`}>REPLAY</button>
                </div>
            </div>
        </div >
    )
}
