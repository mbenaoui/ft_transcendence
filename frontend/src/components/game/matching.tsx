import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { v4 as uuid } from 'uuid';

import { AppProps, userData, userProps } from '@/interface/data'
import { Socket } from 'socket.io-client';
import { fetchCurrentUser } from '@/hooks/userHooks';
import { Constant } from '@/constants/constant';
import { getLevel } from './listOfFriends';
const Matching = ({ socket }: { socket: Socket }) => {
    const router = useRouter()
    const [opponent, setOpponent] = useState<userProps>()
    const [currentUser, setCurrentUser] = useState<userProps>(userData);
    const [game, setGame] = useState(false)
    fetchCurrentUser({ setCurrentUser })
    useEffect(() => {
        if ((currentUser.gameStatus && currentUser.id) || currentUser.gameStatus == 'match') {
            router.push('/game')
            return
        }
        if (currentUser.id)
            setGame(true)
        socket?.emit('userjointToGame', { userId: currentUser.id })
        socket?.emit("searchForOpponent", { currentUser: currentUser })
        socket?.on('searchForOpponent', (opponentt: userProps) => {
            setOpponent(opponentt)
        })
        socket?.on('withdrawalFromMatching', (opponentt: userProps) => {
            setOpponent(undefined)
        })
    }, [currentUser, socket])
    useEffect(() => {
        (
            async () => {
                try {

                    if ((currentUser.gameStatus && currentUser.id) || currentUser.gameStatus == 'match') {
                        router.push('/game')
                        return
                    }
                    if (currentUser.id)
                        setGame(true)
                    if (currentUser.id) {
                        const response_ = await fetch(`${Constant.API_URL}/game/room/play/1`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                'gameStatus': 'match'
                            }),
                            credentials: 'include',
                        });
                    }
                } catch (error) {

                }
            }
        )()
    }, [currentUser])
    const handelChallenge = async () => {
        try {
            const response = await fetch(`${Constant.API_URL}/users/getbyuserid/${opponent?.id}`, {
                credentials: 'include',
            });
            if (response.status == 200) {
                const content = await response.json();
                if (content.isOnline == false) {
                    const room: string = uuid();
                    socket?.emit('userjointToGame', { userId: currentUser.id })
                    const response_ = await fetch(`${Constant.API_URL}/game/room/play/1`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            'gameStatus': 'toMatch'
                        }),
                        credentials: 'include',
                    });
                    const responsePost = await fetch(`${Constant.API_URL}/game/room/${currentUser.id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            'room': room,
                            'opponentId': Number(opponent?.id)
                        }),
                        credentials: 'include',
                    });
                    const responsePost2 = await fetch(`${Constant.API_URL}/game/room/${opponent?.id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            'room': room,
                            'opponentId': Number(currentUser.id)
                        }),
                        credentials: 'include',
                    });
                    if (responsePost.ok && responsePost2.ok && response_.ok)
                        router.push(`/game/online?settings=true`);
                }
            }
        } catch (error) {
        }
    }
    if (game)
        return (

            <div className="Gamebackground w-full  h-screen flex justify-center  ">
                <div className="relative flexjustify-around items-center z-10 OnlineCard overflow-hidden------ w-full sm:w-[90%]  md:w-[80%] lg:w-[70%] xl:w-[50]  h-[450px] md:h-[500px] lg:h-[550px] xl:h-[650px] mt-[140px] max-w-[1200px] rounded-2xl bg-slate-40 p-2 md:p-4">
                    <div className="w-full h-[90%] flex flex-col md:flex-row justify-around items-center">
                        <UserOverview user={currentUser} name='my' />
                        <div className="w-[20%] flex justify-center items-center">
                            <Image src={'/icons-ping-pong-white.png'} alt={"reload"} width={30} height={30} className=" block md:hidden" />
                            <Image src={'/icons-ping-pong-white.png'} alt={"reload"} width={60} height={60} className=" md:block hidden" />
                        </div>
                        {
                            !opponent ? (

                                <div className="w-[70%] md:w-[40%] h-2/3 bg-[#1F2025] rounded-xl flex justify-center items-center">
                                    <Image src={'/game/loading.gif'} alt={"reload"} width={60} height={60} className="" />
                                </div>
                            ) : (
                                <UserOverview user={opponent} name='your' />
                            )
                        }
                    </div>
                    <div className="w-full h-[20]   p-1 flex justify-between  font-semibold">
                        <button onClick={!opponent ? () => router.push('/game') : undefined}
                            className={`py-2 px-9 rounded-md ${!opponent ? ' bg-white ' : ' bg-slate-500'}`}>
                            Leave
                        </button>
                        <button onClick={opponent ? handelChallenge : undefined}
                            className={`py-2 px-6 rounded-md ${opponent ? ' bg-white ' : ' bg-slate-500'}`}>
                            To Match
                        </button>
                    </div>
                </div>
            </div>
        )
    return (
        <></>
    )
}

export default Matching

const UserOverview = ({ user, name }: { user: userProps, name: string }) => {
    return (
        <div className=" overflow-hidden font-sans w-[70%] md:w-[40%] h-2/3 bg-[#1F2025] rounded-2xl flexitems-centerjustify-around  relative">
            <div className=" relative h-1/3 w-full bg-[#205BF1] rounded-t-2xl flex justify-end items-center">
                <div className="text-xl sm:text-2xl text-[#EEF0F6] p-10 relative top-1 md:top-4">
                    LEVEL:{getLevel(user.level)}
                </div>
                <div className=" absolute w-[80px] h-[80px] md:w-[100px] md:h-[100px] bg-[#EEF0F6] rounded-full top-[30%] md:top-[50%] left-5 border-4 border-[#1F2025]">
                    <Image className='rounded-full' src={user.foto_user} fill style={{ objectFit: "cover" }} alt='user'></Image>
                </div>
            </div>
            <div className="h-2/3 w-full flex flex-row md:flex-col pt-5  md:pt-10">
                <div className="w-full flex items-center px-5 md:p-5 space-x-5  ">
                    <div className="text-[#EEF0F6] text-xl sm:text-2xl md:text-3xl   capitalize  font-bold overflow-hidden whitespace-nowrap overflow-ellipsis w-[120px] sm:w-max">{user.username}</div>
                    <Image className='w-[40px] h-[40px] lg:w-[60px] lg:h-[60px]' src={'/game/grad/grad-1.svg'} width={60} height={60} alt='grad'></Image>
                </div>
                <div className="w-full text-[#a0a0a0] md:px-5  bottom-2 relative text-base md:text-lg ">Won: {user.won ? user.won : 0}</div>
                <div className="w-full text-[#a0a0a0] md:px-5 bottom-2 relative text-base md:text-lg">Lost: {user.lost ? user.lost : 0}</div>
                {/* <button hidden={name == 'my'} className='py-2 px-4  md:px-5 md:py-3 rounded-xl bg-[#205BF1] text-[#EEF0F6] font-semibold  absolute  bottom-3 right-3 md:bottom-4 md:right-4'>Friend</button> */}
                {/* <button hidden={name == 'my'} className='p-2 md:p-3 rounded-xl bg-[#205BF1] text-[#EEF0F6] font-semibold  absolute  bottom-3 right-3 md:bottom-4 md:right-4'>Add Friend</button> */}
            </div>
        </div>
    )
}
