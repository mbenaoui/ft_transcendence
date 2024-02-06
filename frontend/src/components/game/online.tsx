import React, { useEffect, useRef, useState, RefObject, useMemo, use } from "react";
import { io } from "socket.io-client";
import { useRouter } from "next/router";
import { userData, userProps } from "@/interface/data";
import { Socket } from "socket.io-client";
import { Ball, Canvas, Player } from "./class";
import Image from "next/image";
import { Constant } from "@/constants/constant";
import { GameIsReady, PlayAgainComp } from "./computer";

import { Open_Sans } from "next/font/google";
import { fetchCurrentUser } from "@/hooks/userHooks";
const openSans = Open_Sans({
    subsets: ['latin']
})
interface InfoGameprops {
    selectPlayer: string;
    setselectPlayer: (selectPlayer: string) => void;
    ballTheme: string
    canvasTheme: string
    socketApp: Socket
    gameIsOk: boolean
    setgameIsOk: (gameIsOk: boolean) => void,
    opponent: userProps
}

const renderGameOverScreen = (MyCanvas: Canvas, ball: Ball, player: Player, computer: Player) => {
    MyCanvas.ClearCanvas();
    MyCanvas.drawRect(player);
    MyCanvas.drawRect(computer);
    MyCanvas.drawMedianLine({ w: 2, h: 10, step: 20, color: MyCanvas.gameInfo.MEDIANLINE });
    MyCanvas.drawTheBall(ball);
};

const PlayOnline = ({ opponent, ballTheme, canvasTheme, setgameIsOk, gameIsOk }: InfoGameprops) => {
    const router = useRouter();
    if (!gameIsOk)
        return
    const [currentUser, setCurrentUser] = useState(userData)

    const GameInfo = {
        FPS: 1000 / 100,
        PLAYER_COLOR: "white",
        PLAYER_HEIGHT: 100,
        PLAYER_WIDTH: 15,
        PLAYER_X: 15,
        PLAYER_Y: 450 / 2 - 100 / 2,
        COMPUTER_X: 900 - 15 - 15,
        COMPUTER_Y: 450 / 2 - 100 / 2,
        THE_BALL: ballTheme,
        BALL_START_SPEED: 2,
        ANGLE: Math.PI / 4,
        RADIUS_BALL: 15,
        LEVEL: 0.05,
        ACCELERATION: 1,
        VELOCIT: 1,
        SPEED: 1,
        RIGHT_PADDEL: canvasTheme == 'canva1' ? "#35d399" : canvasTheme == 'canva2' ? '#f2f3f5' : '#070D37',
        LEFT_PADDEL: canvasTheme == 'canva1' ? "#fb7185" : canvasTheme == 'canva2' ? '#f2f3f5' : '#070D37',
        CANVAS_COLOR: canvasTheme == 'canva1' ? "#f2f3f5" : canvasTheme == 'canva2' ? '#1f1a1b' : '#548bf8',
        MEDIANLINE: canvasTheme == 'canva1' ? "black" : canvasTheme == 'white' ? '#f2f3f5' : 'white',
        CANVAS_HIEGHT: 450,
        CANVAS_WIDTH: 900,
    };

    const player = new Player(GameInfo.PLAYER_X, GameInfo.PLAYER_Y, GameInfo.PLAYER_WIDTH, GameInfo.PLAYER_HEIGHT, GameInfo.LEFT_PADDEL);
    const computer = new Player(GameInfo.COMPUTER_X, GameInfo.PLAYER_Y, GameInfo.PLAYER_WIDTH, GameInfo.PLAYER_HEIGHT, GameInfo.RIGHT_PADDEL);
    const ball = new Ball(GameInfo.CANVAS_WIDTH / 2, GameInfo.CANVAS_HIEGHT / 2, GameInfo);
    const myCanvasRef = useRef<HTMLCanvasElement>(null);
    const [socket, setsocket] = useState<any>();
    const [numberPlayer, setnumberPlayer] = useState(0);
    const playagain = useRef(0)
    const [roomAvailable, setroomAvailable] = useState(true);
    const YouWonOrLostPlayAgain = useRef("");
    const playerLocation = useRef('left')
    const [pause, setPause] = useState(false)
    const [game, setGame] = useState(false)
    const [gameStatus, setgameStatus] = useState({ player1Score: 0, player2Score: 0, yourStatus: '', yourPoints: 0 })
    const [gameStart, setGameStart] = useState(false)
    const [matchEnding, setmatchEnding] = useState(false)

    fetchCurrentUser({ setCurrentUser })
    const windowWidth = useRef(window.innerWidth)
    useEffect(() => {
        if (window.innerWidth < 1500)
            windowWidth.current = 15 + (15 - 15 * (window.innerWidth / 1500))
        else
            windowWidth.current = 17
        const handleRisize = () => {
            if (window.innerWidth < 1500) {
                windowWidth.current = 15 + (15 - 15 * (window.innerWidth / 1500))
            }
        }
        window.addEventListener('resize', handleRisize);
        return () => {
            window.removeEventListener('resize', handleRisize);
        };
    }, [])
    const [pointCard, setPointCard] = useState(false)
    let MyCanvas = useRef<Canvas>();
    let x = useRef(0)
    useEffect(() => {
        if (!myCanvasRef.current) return;
        MyCanvas.current = new Canvas(myCanvasRef.current, GameInfo)
        x.current++
    }, [numberPlayer])

    useEffect(() => {
        if (currentUser.id) {
            setGame(true)
        }
        const socketUrl = `${Constant.API_URL}/gameGateway`;
        const newSocket = io(socketUrl, {
            transports: ["websocket"],
            withCredentials: true
        });
        newSocket.emit("joinRoom", { room: currentUser.room, userId: currentUser.id, opponentId: currentUser.opponentId });
        newSocket.on('initGame', (game_) => {
            setnumberPlayer(2);
            const message = JSON.parse(game_);
            ball.radiusX = windowWidth.current
            playerLocation.current = message.game.player1_Id == currentUser.id ? 'left' : message.game.player2_Id == currentUser.id ? 'right' : ''
        })

        newSocket.on('updateGame', (game) => {
            const message = JSON.parse(game);
            setPause(false)
            setGameStart(true)
            ball.radiusY = 15
            ball.radiusX = windowWidth.current
            ball.x = message.game.Ball.ballX
            ball.y = message.game.Ball.ballY
            player.y = message.game.player1.y
            computer.y = message.game.player2.y
            playerLocation.current == 'right' ?
                setgameStatus({
                    player1Score: message.game.player1.score,
                    player2Score: message.game.player2.score,
                    yourStatus: message.game.player2.status,
                    yourPoints: message.game.player2.points,
                }) :
                playerLocation.current == 'left' ?
                    setgameStatus({
                        player1Score: message.game.player1.score,
                        player2Score: message.game.player2.score,
                        yourStatus: message.game.player1.status,
                        yourPoints: message.game.player1.points,
                    }) : null
            if (MyCanvas.current)
                renderGameOverScreen(MyCanvas.current, ball, player, computer);
        });
        newSocket.on("playAgainIsDone", () => {
            setPointCard(false)
            setGameStart(false)
            setnumberPlayer(2);
        })
        newSocket.on("ResumePause", (value: string) => {
            setPause(true)
        })
        newSocket.on("leaveRoom", () => {
            setnumberPlayer(-1)
            setroomAvailable(false)
        })
        newSocket.on("matchEnding", () => {
            setnumberPlayer(-1)
            setmatchEnding(true)
        })
        newSocket.on("documentHidden", (flag: boolean) => {
            const value = "Resume"
            player.status = value
            computer.status = value
        })
        newSocket.on("playAgain", (flag: boolean) => {
            playagain.current = playagain.current - 1
        })
        setnumberPlayer(1);
        setsocket(newSocket);
        return () => {
            newSocket.disconnect();
        };
    }, [currentUser]);

    const handelButtonPlayAgain = () => {
        setnumberPlayer(1);
        setgameStatus({ player1Score: 0, player2Score: 0, yourStatus: '', yourPoints: 0 })
        socket?.emit('playAgain', { room: currentUser.room, userId: currentUser.id })
    }
    const handleMouseMove = (e: any) => {
        const rect = e.target.getBoundingClientRect();
        if (e.clientY - rect.top - GameInfo.PLAYER_HEIGHT / 2 > 0 && e.clientY - rect.top + GameInfo.PLAYER_HEIGHT / 2 < GameInfo.CANVAS_HIEGHT) {
            const posY = e.clientY - rect.top - (GameInfo.PLAYER_HEIGHT / 2)
            const posX = e.clientX
            socket.emit('MouseMove', { newPositionX: posX, newPositionY: posY, room: currentUser.room, userid: currentUser.id })
        }
    }
    const [pauseGame, setPauseGame] = useState(false)
    const handelButtonGameStatus = () => {
        if (!pause)
            setPauseGame(true)
        socket?.emit('ResumePause', { room: currentUser.room, userId: currentUser.id })
    }
    const handelButtonLeave = () => {
        router.push('/game');
    }
    const handelButtonYouWon = () => {
        router.push("/game")
    }
    const handelButtonYouLost = () => {
        router.push("/game")
    }

    if (game)
        return (
            <div className="Gamebackground  w-full  h-screen flex  justify-center   ">
                <div className=" relative w-full  max-w-[1700px]  h-[800px] flex flex-col  justify-center items-center  mt-[70px]">
                    {playerLocation.current == 'left' ?
                        <ScoreBoard direction={'left'} opponent={opponent} currentUser={currentUser} gameStatus={gameStatus}
                            pause={pause} handelButtonGameStatus={handelButtonGameStatus} handelButtonLeave={handelButtonLeave} />
                        :
                        <ScoreBoard direction={'right'} opponent={opponent} currentUser={currentUser} gameStatus={gameStatus}
                            pause={pause} handelButtonGameStatus={handelButtonGameStatus} handelButtonLeave={handelButtonLeave} />
                    }
                    <div className=" relative w-full h-[600px] flex justify-center items-center ">
                        {numberPlayer == 1 ? (
                            <div className=" w-full h-[100%] flex items-center flex-col">

                                <div
                                    className={`OnlineCard rounded-b-md flex justify-center items-center space-x-6 absolute z-0    md:rounded-b-lg w-[99%] h-[70%]     md:w-[70%] 2xl:h-[100%] 2xl:w-[60%] `}

                                >
                                    <Image src={'/game/loading.gif'} alt={"reload"} width={60} height={60} className="" />
                                    <div className=" text-xl md:text-2xl text-white">
                                        Please Wait
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        {numberPlayer == 2 ? (
                            <div className={`${!roomAvailable ? " hidden " : ""} relative w-full h-[100%] flex justify-center`}>
                                <canvas
                                    className={` absolute z-0   border-2 rounded-b-sm md:rounded-b-lg w-[99%] h-[70%]     md:w-[70%] 2xl:h-[100%] 2xl:w-[60%] `}
                                    ref={myCanvasRef}
                                    width={900}
                                    height={450}
                                    onMouseMove={handleMouseMove}
                                >
                                </canvas>
                                {!gameStart ? (
                                    <GameIsReady username={currentUser.username} opponenetUsername={opponent.username} userImage={currentUser.foto_user} opponentImage={opponent.foto_user} />
                                ) : null
                                }
                                {
                                    pause ? (
                                        <div className=" absolute  w-full h-[100%] flex justify-center">
                                            <div
                                                className={` absolute z-0 OnlineCard   rounded-b-sm md:rounded-b-lg w-[99%] h-[70%]     md:w-[70%] 2xl:h-[100%] 2xl:w-[60%] flex justify-center items-center space-x-6 `}
                                            >
                                                <div className="w-[400px] h-[300px] md:w-[500px] md:h-[350px] bg-white rounded-xl shadow-2xl flex flex-col justify-around items-center -space-y-3">
                                                    {/* <div className=" text-3xl font-bold">
                                                You Won
                                            </div> */}
                                                    <div className=" capitalize text-2xl text-center">
                                                        {/* your opponent conceded the match. */}
                                                        {
                                                            pauseGame ?
                                                                '' :
                                                                'Please Wait'
                                                        }
                                                    </div>
                                                    <Image src={'/game/loading.gif'} alt={"reload"} width={60} height={60} className="" />
                                                    <button className="w-[80%]  bg-blue-300 py-3 text-3xl font-bold text-blue-700 rounded-xl"
                                                        onClick={pauseGame ? handelButtonGameStatus : handelButtonYouWon}
                                                    >{pauseGame ? 'Resume' : 'Leave'}</button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : null
                                }
                            </div>
                        ) : null}
                        {
                            !roomAvailable && gameStatus.yourStatus == '' ? (
                                <div className="relative w-full h-[100%] flex justify-center">
                                    <div
                                        className={` absolute z-0 OnlineCard   rounded-b-sm md:rounded-b-lg w-[99%] h-[70%]     md:w-[70%] 2xl:h-[100%] 2xl:w-[60%] flex justify-center items-center space-x-6 `}
                                    >
                                        <div className="w-[400px] h-[300px] md:w-[500px] md:h-[350px] bg-white rounded-xl shadow-2xl flex flex-col justify-around items-center -space-y-3">
                                            <div className=" text-3xl font-bold">
                                                You Won
                                            </div>
                                            <div className=" capitalize text-2xl text-center">
                                                your opponent conceded the match.
                                            </div>
                                            <button className="w-[80%]  bg-blue-300 py-3 text-3xl font-bold text-blue-700 rounded-xl"
                                                onClick={handelButtonYouWon}
                                            >OK</button>
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        }
                        {
                            matchEnding ? (
                                <div className="relative w-full h-[100%] flex justify-center">
                                    <div
                                        className={` absolute z-0 OnlineCard   rounded-b-sm md:rounded-b-lg w-[99%] h-[70%]     md:w-[70%] 2xl:h-[100%] 2xl:w-[60%] flex justify-center items-center space-x-6 `}
                                    >
                                        <div className="w-[400px] h-[300px] md:w-[500px] md:h-[350px] bg-white rounded-xl shadow-2xl flex flex-col justify-around items-center -space-y-3">
                                            <div className=" text-3xl font-bold">
                                                The Match Ending
                                            </div>
                                            <div className=" capitalize text-2xl text-center">
                                                The room has been closed.
                                            </div>
                                            <button className="w-[80%]  bg-blue-300 py-3 text-3xl font-bold text-blue-700 rounded-xl"
                                                onClick={handelButtonYouWon}
                                            >OK</button>
                                        </div>
                                    </div>
                                </div>
                            ) : null
                        }
                        {
                            gameStatus.yourStatus != '' ? (
                                <div className="absolute  w-full h-[100%] flex justify-center " >
                                    <div className="OnlineCard  rounded-sm md:rounded-lg w-[99%] h-[70%]      md:w-[70%] 2xl:h-[100%] 2xl:w-[60%] flex justify-center items-center ">
                                        {
                                            !pointCard ? (
                                                <div className="w-full h-full  flex justify-center items-center">
                                                    <div className=" relative w-[100%] h-[100%] flex justify-center items-center ">
                                                        <div className=" absolute w-[90%] max-w-[500px] h-[380px]">
                                                            <Image className=" rounded-xl " fill style={{ objectFit: "cover" }} alt="points" src={gameStatus.yourStatus == 'won' ? '/game/youwon.svg' : '/game/youlost.svg'} />
                                                            <div className=" absolute z-10 w-full h-full bg-red-20  flex flex-col justify-center items-center space-y-0">
                                                                <div className=" relative text-2xl  top-[22px] text-[#f8ff34]  ">
                                                                    {
                                                                        gameStatus.yourStatus == 'won' ? 'You Won' : 'You Lost'
                                                                    }
                                                                </div>
                                                                <div className=" relative text-yellow-400 text-base 2xl:text-xl  top-[50px] -right-1">
                                                                    +{gameStatus.yourPoints}
                                                                </div>
                                                                <button onClick={() => setPointCard((pre) => !pre)} className=" relative NextButton text-yellow-400  2xl:text-3xl  text-xl top-[120px]" >
                                                                    Next
                                                                </button>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            ) : (
                                                <PlayAgainComp roomAvailable={roomAvailable} handelReplay={!roomAvailable ? undefined : handelButtonPlayAgain} handelExit={handelButtonYouLost} />
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

    return (
        <></>
    )
};

export default PlayOnline;
interface ScoreBoardProps {
    gameStatus: { player1Score: number, player2Score: number, yourStatus: string, yourPoints: number }
    currentUser: userProps
    opponent?: userProps
    direction: string
    handelButtonGameStatus: () => void
    pause: boolean
    handelButtonLeave: () => void
    Ai?: Boolean
    AiProfile?: string
}
export const ScoreBoard = ({ currentUser, opponent, gameStatus, direction, handelButtonGameStatus, pause, handelButtonLeave, AiProfile }: ScoreBoardProps) => {
    return (
        <div className=" font-mono w-[99%]    md:w-[70%] 2xl:w-[60%] h-[65px] md:h-[90px] flex justify-between items-center text-lg md:text-2xl font-semibold  bg-[#38385F] text-[#FFF] rounded-t-3xl px-1 py-2 md:px-2 lg:p-3">
            <div className="w-[40%] flex items-center space-x-1 md:space-x-2  h-full ">
                <div className="h-full w-[80%] flex items-center space-x-1 md:space-x-2">
                    <div className="h-full w-2/5 md:w-1/4   flex items-center">
                        <div className="relative  h-[40px] w-[40px]  sm:h-[60px] sm:w-[60px] lg:h-[70px] lg:w-[70px] ">
                            <Image className=" rounded-full " src={direction == 'right' ? currentUser.foto_user : `${opponent ? opponent.foto_user : AiProfile}`} fill style={{ objectFit: "cover" }} alt={'user foto'} />
                        </div>
                    </div>
                    <div className="w-3/5 md:w-3/4 text-start overflow-hidden whitespace-nowrap overflow-ellipsis capitalize ">{direction == 'right' ? currentUser.username : `${opponent ? opponent.username : 'Ai'}`}</div>
                </div>
                <div className="h-full text-3xl w-[20%] flex items-center justify-center space-x-1 bg-[#555595] border-l-2 border-y-2 rounded-l-xl border-white">
                    {gameStatus.player2Score}
                </div>
            </div>
            <div className="w-[20%] h-full flex justify-center items-center space-x-2 bg-[#555595] border-y-2 border-white">
                <button onClick={handelButtonGameStatus} className="relative w-[30px] h-[30px] md:w-[40px] md:h-[40px]  flex justify-center items-center   border-[#5041BC]">
                    <Image src={pause ? '/game/play.png' : '/game/pause.png'} sizes="[]" alt="pause" fill></Image>
                </button>
                <button onClick={handelButtonLeave} className="relative w-[30px] h-[30px] md:w-[40px]  md:h-[40px]  flex justify-center items-center">
                    <Image src={'/game/exit.svg'} alt="exit" fill />
                </button>
            </div>
            <div className="w-[40%] flex items-center space-x-1 md:space-x-2  h-full ">
                <div className="h-full text-3xl w-[20%] flex items-center justify-center space-x-1 bg-[#555595] border-r-2 border-y-2 border-white rounded-r-xl">
                    {gameStatus.player1Score}
                </div>
                <div className="h-full w-[80%] flex items-center space-x-1 md:space-x-2">
                    <div className="w-3/5 md:w-3/4 text-end overflow-hidden whitespace-nowrap overflow-ellipsis capitalize ">{direction == 'right' ? `${opponent ? opponent.username : 'Ai'}` : currentUser.username}</div>
                    <div className="h-full w-2/5 md:w-1/4   flex items-center">
                        <div className="relative  h-[40px] w-[40px]  sm:h-[60px] sm:w-[60px] lg:h-[70px] lg:w-[70px] ">
                            <Image className=" rounded-full " src={direction == 'right' ? `${opponent ? opponent.foto_user : AiProfile}` : currentUser.foto_user} fill style={{ objectFit: "cover" }} alt={'user foto'} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}