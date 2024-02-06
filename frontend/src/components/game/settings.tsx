import router from 'next/router'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Pagination, Virtual } from 'swiper/modules';
import Link from 'next/link';
import { userData, userProps } from '@/interface/data';
import { Socket } from 'socket.io-client';
import { fetchCurrentUser, getCurrentUser } from '@/hooks/userHooks';
import { Constant } from '@/constants/constant';

import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


export interface SettingsProps {
    selectPlayer: string
    ballTheme: string
    canvasTheme: string
    setballTheme: (ballTheme: string) => void
    setcanvasTheme: (canvasTheme: string) => void
    gameLevel: string
    setgameLevel: (gameLevel: string) => void
    setRouterPage: (routerPage: string) => void
    socket: Socket
    gameIsOk: boolean
    setgameIsOk: (gameIsOk: boolean) => void
    setCurrentUser: (currentUser: userProps) => void
    currentUser: userProps
    setopponent: (opponent: userProps) => void
    opponent: userProps
}

const CanvasSwiper = ({ ballTheme, setcanvasTheme }: { ballTheme: string, setcanvasTheme: (canvasTheme: string) => void }) => {
    const CanvaDesing: Array<any> = [
        { canvaName: 'canva1', canvaColor: 'bg-[#f2f3f5]', player1: 'bg-[#fb7185]', player2: 'bg-[#35d399]' },
        { canvaName: 'canva2', canvaColor: 'bg-[#1f1a1b]', player1: 'bg-[#f2f3f5]', player2: 'bg-[#f2f3f5]' },
        { canvaName: 'canva3', canvaColor: 'bg-[#548bf8]', player1: 'bg-[#070D37]', player2: 'bg-[#070D37]' }]
    return (
        <Swiper
            className='w-full h-[70%]'
            slidesPerView={1}
            pagination={{
                clickable: true,
            }}
            centeredSlides={true}
            modules={[Pagination]}
        >
            {
                CanvaDesing.map((desing, index) => (

                    <SwiperSlide key={index} className='w-full h-full ' virtualIndex={3}>
                        {
                            ({ isActive }) => {
                                useEffect(() => {
                                    isActive ? setcanvasTheme(desing.canvaName) : null
                                }, [isActive])
                                return (
                                    <div key={index} className=" w-full h-full bg-slate-5 p-4 flex justify-center items-center rounded-xl">
                                        <div className={`${desing.canvaColor} w-full h-[100%]  p-4 flex flex-col justify-center rounded-xl`}>
                                            <div className=" w-full h-[70px] ">
                                                <div className={`h-full w-[12px] ${desing.player1}`} />
                                            </div>
                                            <div className=" w-full h-[70px] flex justify-center items-center ">
                                                <div className="relative h-[40px] w-[40px] rounded-full">
                                                    <Image alt='ball87' src={ballTheme} fill />
                                                </div>                                        </div>
                                            <div className=" w-full h-[70px]  flex justify-end">
                                                <div className={`h-full w-[12px] ${desing.player2}`} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            }}
                    </SwiperSlide>
                ))
            }
        </Swiper >
    )
}

const BallSwiper = ({ setballTheme }: { setballTheme: (ballTheme: string) => void }) => {
    const [windowWidth, setWindoWidth] = useState(window.innerWidth)
    useEffect(() => {
        const handleRisize = () => {
            setWindoWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleRisize);
        return () => {
            window.removeEventListener('resize', handleRisize);
        };

    }, [])
    const balls: Array<string> = ['/game/ball-2.svg', '/game/ball-3.svg', '/game/ball-4.svg', '/game/ball-5.svg', '/game/ball-6.svg',]
    return (
        <Swiper
            className='w-full h-[50%] mt-20   p-4 rounded-xl'
            slidesPerView={windowWidth < 1200 ? 2 : 3}
            pagination={{
                clickable: true,
            }}
            modules={[Pagination]}
            centeredSlides={true}
        >
            {
                balls.map((ball: string, index) =>
                (
                    <SwiperSlide key={index} className=' p-2' >
                        {
                            ({ isActive }) => {
                                useEffect(() => {
                                    isActive ? setballTheme(ball) : null
                                }, [isActive])
                                return (
                                    <div className={`w-full h-full flex justify-center items-center rounded-xl  border-2 ${isActive ? ' border-black ' : null} `}>
                                        <div className=" relative  w-[70%] h-[80%] b-slate-500 ">
                                            <Image src={ball} fill alt='ball'></Image>
                                        </div>
                                    </div>
                                )
                            }
                        }
                    </SwiperSlide>
                ))
            }
        </Swiper >
    )
}

const LevelSwiper = ({ setgameLevel }: { setgameLevel: (gameLevel: string) => void }) => {
    const GameLevel = [
        { level: 'easy', style: 'EasyCard', styleRevers: 'EasyCardrevers' },
        { level: 'medium', style: 'MediumCard', styleRevers: 'MediumCardrevers' },
        { level: 'hard', style: 'HardCard', styleRevers: 'HardCardrevers' }]
    return (
        <Swiper
            className='w-full h-[70%] mt-4'
            slidesPerView={2}
            centeredSlides={true}
            pagination={{
                clickable: true,
            }}
        >
            {
                GameLevel.map((lvl, index) =>
                (
                    <SwiperSlide key={index} className='' >
                        {
                            ({ isActive }) => {
                                useEffect(() => {
                                    isActive ? setgameLevel(lvl.level) : null
                                }, [isActive])
                                return (
                                    <div className={`w-full h-[80%]  mt-10 p-4 flex justify-center items-center rounded-xl  border-2 ${isActive ? ' border-black ' : null}`}>
                                        <div className={`${lvl.style} w-[100%] md:w-[80%] h-[60%]  rounded-3xl flex justify-center items-center pb-5 pl-2 pr-2 pt-2 `}>
                                            <div className={`w-full h-full ${lvl.styleRevers}  rounded-3xl flex justify-center flex-col items-center`}>
                                                <div className="w-full flex justify-center">
                                                    <div className="w-14 h-14 relative  ">
                                                        <Image src={'/game/star-2.svg'} alt={lvl.level} fill />
                                                    </div>
                                                    <div className="w-14 h-14 relative  ">
                                                        <Image src={`/game/star-${lvl.level == 'easy' ? '3' : '2'}.svg`} alt={lvl.level} fill />
                                                    </div>
                                                    <div className="w-14 h-14 relative  ">
                                                        <Image src={`/game/star-${lvl.level == 'hard' ? '2' : '3'}.svg`} alt={lvl.level} fill />
                                                    </div>
                                                </div>
                                                <div className="w-full text-xl md:text-3xl text-center mt-4  text-white">
                                                    {lvl.level.toUpperCase()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        }
                    </SwiperSlide>
                ))
            }

        </Swiper >
    )
}

const ButtonSlideNavToRight = () => {
    const swiper = useSwiper()
    return (

        <button
            className=' p-1 rounded-md rotate-180'
            onClick={() => swiper.slideNext()}
        >
            <Image src={'/game/left-arrow.png'} alt='next' width={30} height={30}></Image>

        </button>
    )
}

const Settings = ({ opponent, setopponent, currentUser, setCurrentUser, setgameIsOk, gameIsOk, socket, selectPlayer, ballTheme, setballTheme, canvasTheme, setcanvasTheme, setRouterPage, gameLevel, setgameLevel }: SettingsProps) => {

    const [watingForOpponent, setwatingForOpponent] = useState(1)
    const [game, setGame] = useState(false)
    useEffect(() => {
        (
            async () => {
                // const user = await getCurrentUser()
                // socket?.emit('userInGame', { userId: user.id })
                // socket?.on('userInGame', () => {
                // })
                if (selectPlayer == 'matching') {
                    socket?.emit('JoinMatch')
                    socket?.on('JoinMatch', () => {
                        setwatingForOpponent((prv) => prv + 1)
                    })
                }
            }
        )();
    }, [socket])
    useEffect(() => {
        (
            async () => {
                try {

                    if (selectPlayer != 'computer') {
                        const response = await fetch(`${Constant.API_URL}/auth/user`, {
                            credentials: 'include',
                        });
                        if (response.ok) {
                            const content = await response.json()
                            if (content.gameStatus != 'toMatch') {
                                if (content.gameStatus || !content.opponentId) {
                                    router.push('/game')
                                    return
                                }
                            }
                            const response_ = await fetch(`${Constant.API_URL}/game/room/play/1`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    'gameStatus': 'settings'
                                }),
                                credentials: 'include',
                            });
                            const response2 = await fetch(`${Constant.API_URL}/users/getbyuserid/${content.opponentId}`, {
                                credentials: 'include',
                            });

                            if (response2.ok && response_.ok) {
                                const data = await response2.json()
                                setCurrentUser(content)
                                setopponent(data)
                                setGame(true)
                            }
                        }
                    }
                    else if (selectPlayer == 'computer')
                        setGame(true)
                } catch (error) {

                }
            }
        )();
    }, [])
    const [optionActive, setoptionActive] = useState(1);
    const handelNextButton = async () => {
        if (watingForOpponent != 2 && selectPlayer == 'matching')
            return
        setgameIsOk(true)
        setRouterPage('play')
        router.push(selectPlayer == 'computer' ? '/game/ai?play=true' : selectPlayer == 'computer' ? '/game/offline?play=true' : '/game/online?play=true')
    }
    if (game)
        return (
            <div className="Gamebackground h-screen w-full    flex  justify-center  ">
                <div className="relative z-10 bg-CusColor_light overflow-hidden w-full sm:w-[90%]  md:w-[80%] lg:w-[70%] xl:w-[50]  h-[450px] md:h-[500px] lg:h-[550px] xl:h-[650px] mt-[140px] max-w-[1200px] rounded-2xl bg-slate-40 flex  justify-around items-center  p-2 md:p-4">
                    <div className="w-[24%] md:w-[30%]  max-w-[200px] h-full  rounded-xl space-y-6">
                        <div className=" relative w-full  py-2   bg-CusColor_gre rounded-xl">
                        </div>
                        <button className={`relative w-full   bg-CusColor_grey rounded-xl flex items-center  space-x-2 ${optionActive == 1 ? 'outline outline-offset-2 md:outline-offset-4 outline-2 outline-blue-800' : null} `}
                            onClick={() => setoptionActive(1)}
                        >
                            <div className=" relative  w-[40%] h-[50px] md:h-[80px]">
                                <Image alt='arrow' src={'/game/canvas-desing.svg'} fill />
                            </div>
                            <div className=" md:text-xl text-blue-800  font-semibold">Stadium</div>
                        </button>
                        <button className={`relative w-full   bg-CusColor_grey rounded-xl flex items-center  space-x-2 ${optionActive == 2 ? 'outline outline-offset-2 md:outline-offset-4 outline-2 outline-blue-800' : null} `}
                            onClick={() => setoptionActive(2)}
                        >
                            <div className=" relative  w-[40%] h-[50px] md:h-[80px]">
                                <Image alt='arrow' src={'/game/ball-2.svg'} fill />
                            </div>
                            <div className=" md:text-xl text-blue-800  font-semibold">Ball</div>
                        </button>
                        {
                            selectPlayer == 'computer' ? (

                                <button className={`relative w-full   bg-CusColor_grey rounded-xl flex items-center  space-x-2 ${optionActive == 3 ? 'outline outline-offset-2 md:outline-offset-4 outline-2 outline-blue-800' : null} `}
                                    onClick={() => setoptionActive(3)}
                                >
                                    <div className=" relative  w-[40%] h-[50px] md:h-[80px]">
                                        <Image alt='arrow' src={'/game/game-level.svg'} fill />
                                    </div>
                                    <div className=" md:text-xl text-blue-800  font-semibold">Level</div>
                                </button>
                            ) : null
                        }
                    </div>
                    <div className=" w-[70%] md:w-[60%] h-full  bg-CusColor_grey rounded-xl fle justify-center items-center p-2">
                        <div className="relative w-full flex justify-betwee items-center py-2">
                            <div className="flex items-center justify-start w-[45%] h-[50px] space-x-1 ">
                                {/* <div className=" relative w-[40px] h-[40px]">
                                    <Image src={currentUser.foto_user} sizes='[]' style={{ objectFit: "cover" }} fill alt='user' className='rounded-full' />
                                </div> */}
                                <div className=" relative w-[40px] h-[40px]">
                                    <Image sizes='[]' src={currentUser.foto_user ? currentUser.foto_user : '/'} style={{ objectFit: "cover" }} fill alt='' className='rounded-full' />
                                </div>
                                <div className="uppercase text-sm lg:text-base min-w-[100px]">{currentUser.username}</div>
                            </div>
                            <div className=" relative  w-[40px] h-[40px] md:w-[50px] md:h-[50px]">
                                <Image src={'/game/versus.png'} fill alt='' sizes='[]' />
                            </div>
                            <div className="flex items-center justify-end w-[45%] h-[50px] space-x-1">
                                <div className="text-sm lg:text-base  text-end min-w-[100px] uppercase">{selectPlayer == 'computer' ? 'Ai' : opponent.username}</div>
                                <div className=" relative w-[40px] h-[40px]">
                                    <Image sizes='[]' src={selectPlayer == 'computer' ? '/game/ai.png' : opponent.foto_user} style={{ objectFit: "cover" }} fill alt='' className='rounded-full' />
                                </div>
                            </div>
                        </div>
                        {
                            optionActive == 1 ? (
                                // <></>
                                < CanvasSwiper ballTheme={ballTheme} setcanvasTheme={setcanvasTheme} />
                            ) : optionActive == 2 ? (
                                < BallSwiper setballTheme={setballTheme} />
                            ) : (
                                < LevelSwiper setgameLevel={setgameLevel} />
                            )
                        }
                    </div>
                    <div className=" absolute z-10 w-[93%] bottom-3 md:bottom-10 flex justify-between px-5 md:px-11  ">
                        <Link href={'/game'} className="BottonsSettings  rotate-180 px-10 py-2 rounded-lg">
                            <div className="rotate-180">
                                Leave
                            </div>
                        </Link>
                        <button onClick={handelNextButton} className={`BottonsSettings  px-10 py-2  ${watingForOpponent != 2 && selectPlayer == 'matching' ? ' opacity-20 ' : '   opacity-100'} rounded-lg`}>
                            Next
                        </button>
                    </div>
                </div >

            </div >
        )
    return (
        <>
        </>
    )

}

export default Settings
