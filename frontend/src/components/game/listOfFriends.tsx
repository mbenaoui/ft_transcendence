import { AppProps, AppPropsNow, userData, userProps } from '@/interface/data'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router';
import { v4 as uuid } from 'uuid';
import { fetchAllAmis, fetchAllUsers, fetchCurrentUser, getCurrentUser } from '@/hooks/userHooks';
import { Constant } from '@/constants/constant';
import { tree } from 'next/dist/build/templates/app-page';
import { number } from 'zod';

interface ExtendedAppProps extends AppPropsNow {
}



export function getTheDateAndTheTime(dateString: string) {

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dateObject = new Date(dateString);

    const year = dateObject.getUTCFullYear();
    const day = dateObject.getUTCDate();
    let hours = dateObject.getUTCHours();
    const minutes = dateObject.getUTCMinutes();
    const monthIndex = dateObject.getUTCMonth();
    const dayOfWeekIndex = dateObject.getUTCDay();
    const monthName = months[monthIndex];
    const dayName = daysOfWeek[dayOfWeekIndex];

    let period = 'AM';
    if (hours >= 12) {
        period = 'PM';
        if (hours > 12) {
            hours -= 12;
        }
    }
    const formattedDate = `${dayName}, ${day.toString().padStart(2, '0')} ${monthName} ${year.toString().padStart(4, '0')} | ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;

    return (formattedDate)
}
const dateString = "2023-10-28T09:04:35.054Z";


export const handelChallenge = async ({ oppId, socket, currentUser, selectUser, setselectUser, router, setclick }: any) => {




    

    const user = await getCurrentUser()
    if (user.gameStatus) {
        router.push('/game')
        return
    }
    const response = await fetch(`${Constant.API_URL}/users/getbyuserid/${oppId}`, {
        credentials: 'include',
    });
    if (response.status == 200) {
        const content = await response.json();
        if (!content.gameStatus) {
            const room: string = uuid();
            const response = await fetch(`${Constant.API_URL}/game/room/${currentUser.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'room': room,
                    'opponentId': Number(oppId)
                }),
                credentials: 'include',
            });
            if (response.ok) {
                if (setclick)
                    setclick(false)
                socket?.emit('userjointToGame', { userId: currentUser.id })
                socket?.emit("areYouReady", {
                    OpponentId: oppId, currentPlayer: currentUser, room: room
                })
                router.push(`/game/online?settings=true`);
            }
        }
        else {
            if (selectUser === -1)
                setselectUser(Number(oppId))
            else
                setselectUser(-1)
        }
    }
}
export const getLevel = (level: number | any): string => {
    if (!level)
        return '0'
    return level.toString().slice(0, level.toString().indexOf('.') + 3)
}
export const extractdecimalNumberFromLevel = (_level: number) => {
    var level: string = _level.toString() + '0'
    const ret = level.toString().indexOf('.') == -1 ? 0 : level.toString().slice(level.toString().indexOf('.') + 1, level.toString().indexOf('.') + 3)
    return Number(ret) > 2 ? ret : 0
}

export const getTheGrad = (level: number) => {
    if (level < 3)
        return '/game/grad/grad-5.svg'
    else if (level < 5)
        return '/game/grad/grad-4.svg'
    else if (level < 8)
        return '/game/grad/grad-3.svg'
    else if (level < 10)
        return '/game/grad/grad-2.svg'
    // else if (level < 3)
    return '/game/grad/grad-1.svg'
}
const ListOfFriends = ({ onlineUsersss, socket }: ExtendedAppProps) => {
    const router = useRouter()
    const [selectUser, setselectUser] = useState<Number>(-1);
    const [historiqueHidden, sethistoriqueHidden] = useState<Number>(-1);
    const [matchs, setMatchs] = useState<Array<any>>([])
    const [game, setGame] = useState(false)

    const [amis, setAmis] = useState<Array<userProps>>([])
    const [currentUser, setCurrentUser] = useState<userProps>(userData);
    const [notFount, setNoutFount] = useState(false)
    fetchCurrentUser({ setCurrentUser })
    fetchAllAmis({ setAmis, currentUser })
    useEffect(() => {
        if (currentUser.gameStatus) {
            router.push('/game')
            return
        }
        else (
            setGame(true)
        )
    }, [currentUser])
    useEffect(() => {
        setNoutFount(amis.length == 0)
    }, [amis])

    const handelHistorique = async (e: any) => {
        setMatchs([])
        sethistoriqueHidden((prev) => prev == -1 ? Number(e.target.value) : -1)
        try {
            const response = await fetch(`${Constant.API_URL}/game/history/${e.target.value}`, {
                credentials: 'include',
            });
            if (response.status == 200) {
                const content = await response.json()
                if (content != undefined)
                    setMatchs(Array.from(content).reverse())
            }
        } catch (error) {

        }
    }

    const handelClearHistorique = async (userid: number) => {
        const response = await fetch(`${Constant.API_URL}/game/history/${userid}`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (response.status == 200) {
            setMatchs([])
            // const content = await response.json()
            // setMatchs(content)
        }
        try {
        } catch (error) {

        }
    }
    if (game)
        return (
            <>
                <div className='w-full   flex  space-y-3 justify-center  h-  '>
                    <div className=' rounded-sm md:rounded-2xl space-y-4 w-[100%] h-[90%] sm:w-[70%]  md:w-[60%] xl:w-[50%]  bg-white flex flex-col items-center mt-14 mb-0 md:mt-20 md:mb-20 '>
                        <div className='relative border-b-2 w-full flex items-center justify-center p-2 '>
                            <button className='flex justify-center items-center' onClick={() => router.push('/game')}>
                                <Image src={'/game/back.png'} alt='get back' width={20} height={20} className=" absolute left-4" />
                            </button>
                            <h1 className='text-black ' >Friends</h1>
                        </div>
                        {
                            (amis.length) ? amis.map((user: userProps, index) => (
                                <div key={index} className=' w-full'>
                                    <div className=' bg-white rounded-2xl items-center  space-x-3 p-2 flex  w-full md:w-[100%] shadow-md relative'>
                                        <div className=' w-[20%] flex flex-col py-2 items-center justify-center space-y-4 border-[1px] border-slate-200 border-spacing-9 rounded-3xl'>
                                            <Image
                                                width={2000}
                                                height={2000}
                                                src={user.foto_user}
                                                alt={`image of: ${user.username}`}
                                                className="w-20   rounded-full border-4 border-balck inline-block" // Adjust the width as needed
                                            />
                                            <div className=' border-2 border-yellow-500 bg-blu-300  rounded-xl bg-blackd w-[80%] h-10  flex items-center justify-center relative'>
                                                <Image fill style={{ objectFit: "cover" }} className='' src={getTheGrad(user.level)} alt='grad'></Image>
                                            </div>
                                        </div>
                                        <div className='bg-rded-400 w-[80%] rounded-lg h-[100%] space-y-4'>
                                            <div className="  flex items-center   bg-rd-200 justify-between space-x-3">
                                                <div className=' text-2xl'>
                                                    {user.username}
                                                </div>
                                                {
                                                    onlineUsersss.includes(user.id) ? (

                                                        <div className=" flex items-center space-x-1">
                                                            <div className="">
                                                                online
                                                            </div>
                                                            <div className='w-[10px] h-[10px] rounded-full bg-green-500' />
                                                        </div>
                                                    ) :
                                                        (
                                                            <div className=" flex items-center space-x-1">
                                                                <div className="">
                                                                    offline
                                                                </div>
                                                                <div className='w-[10px] h-[10px] rounded-full bg-red-400' />
                                                            </div>
                                                        )
                                                }
                                            </div>
                                            <div className="w-[100%] h-10  rounded-xl bg-[#D3E3FC] flex  items-center relative ">
                                                <div className="absolute w-full h-full flex justify-center items-center">
                                                    <div className="">
                                                        LEVEL {getLevel(user.level)}
                                                    </div>
                                                </div>
                                                <div style={{
                                                    width: `${extractdecimalNumberFromLevel(user.level)}%`
                                                }} className={`  duration-500 h-10  rounded-xl bg-[#77A6F7]`}>
                                                </div>
                                            </div>
                                            <div className="flex justify-between ">
                                                <button value={`${user.id}`} onClick={() => onlineUsersss.includes(user.id) ? handelChallenge({ oppId: user.id, socket: socket, currentUser: currentUser, selectUser: selectUser, setselectUser: setselectUser, router: router }) : undefined}
                                                    className={`${onlineUsersss.includes(user.id) ? ' bg-[#6592e1] ' : ' bg-[#99b8ea] '}    rounded-xl px-4 py-2`}>Challenge</button>
                                                <button value={`${user.id}`} onClick={handelHistorique} className='bg-white border-black border-2 rounded-xl px-4 py-2'>Historique</button>
                                            </div>
                                        </div>
                                        <div className={`bg-white text-blue-800  w-[250px] h-[170px] flex flex-col justify-between items-center  absolute z-10  -bottom-[190px] rounded-2xl p-4 shadow-xl ${!(user.id === selectUser) ? 'hidden' : ""}`}>
                                            <div className="w-full flex justify-end">
                                                <button onClick={() => setselectUser(-1)}>
                                                    <Image width={30} height={30} src={'/clean.png'} alt='x' />
                                                </button>
                                            </div>
                                            <div className="text-center w-full text-xl md:text-2xl relative -top-6">
                                                This Player is not Available new.
                                            </div>
                                        </div>
                                    </div>
                                    {(user.id == historiqueHidden) && (
                                        <div className=' bg-redd-200  w-full  bg-bldue-200 rounded-xl flex flex-col items-center justify-center space-y-5' >
                                            <div className=" relative bg-rded-200 w-full h-10 flex justify-center items-center">
                                                <div className="w-[200px] h-[10px] bg-yellow-300"></div>
                                                <div className="w-[200px]  text-yellow-300 uppercase text-center text-3xl">
                                                    Historique
                                                </div>
                                                <div className="w-[200px] h-[10px] bg-yellow-300"></div>
                                                <button onClick={() => handelClearHistorique(user.id)} hidden={(matchs.length ? false : true)} className=" absolute  right-1 px-5 py-1  bg-blue-400  hover:bg-blue-300 rounded-lg top-7">Clear</button>
                                            </div>
                                            {
                                                (matchs.length) ? matchs.map((match: any, index: any) => (
                                                    <div key={index} className="w-[96%] ms:w-[80%] h-20  rounded-xl flex flex-col justify-center item-center bg-sred-200 mt-4">

                                                        <div className="bg-blue-800 mx-[20%] text-sm text rounded-t-3xl h-10 mt-2 text-white flex justify-center items-center">
                                                            {getTheDateAndTheTime(match.createdAt)}
                                                        </div>

                                                        <div className="bg-blue-500 w-full flex justify-center items-start h-16 rounded-md">
                                                            <div className="bg-reds-200 w-[40%] h-full flex justify-between items-center">
                                                                <Image className='w-12 rounded-l-md'
                                                                    src={user.foto_user} width={200} height={200} alt={'player Image'}>
                                                                </Image>
                                                                <h1 className='pr-10  uppercase text-white font-bold text-xl'>{user.username}</h1>
                                                            </div>
                                                            <div className="bg-blue-800 w-[20%] h-12 flex flex-col justify-end item">
                                                                <div className='bg-reds-400 flex justify-around items-center  text-xl font-bold text-white'>
                                                                    <span>{match.opponentGools}</span>
                                                                    <span>-</span>
                                                                    <span>{match.myGools}</span>
                                                                </div>
                                                                <div className="w-15 h-3 bg-yellow-300  rounded-t-[8px] ">
                                                                </div>
                                                            </div>
                                                            <div className="bg-reds-200 w-[40%] h-full flex justify-between items-center">
                                                                <h1 className='pl-10  uppercase text-white font-bold text-xl'>{currentUser.username}</h1>
                                                                <Image className='w-12 rounded-r-md'
                                                                    src={currentUser.foto_user} width={200} height={200} alt={'player Image'}>
                                                                </Image>
                                                            </div>
                                                        </div>
                                                    </div>

                                                )) : null
                                            }
                                        </div>)}
                                </div>

                            )) : (
                                <div hidden={!notFount} className={`flex  w-full 300   justify-center `}>
                                    <footer className='w-[60%]  min-w-[230px] max-w-[760px] rounded-2xl mt-20 py-10 flex flex-col justify-start items-center space-y-3'>
                                        <div className="mt-20 bg-green-w500 flex items-end -space-x-2">
                                            <div className="">
                                                <Image className='border-2 border-white rounded-full w-[50px] h-[50px]' width={500} height={500} src={'/search/man.png'} alt='woman iamge' />
                                            </div>
                                            <div className=" z-10">
                                                <Image className=' border-2 border-white rounded-full w-[60px] h-[60px]' priority width={600} height={600} src={'/search/woman.png'} alt='woman iamge'></Image>
                                            </div>
                                            <div className="">
                                                <Image className='  border-2 border-white rounded-full w-[50px] h-[50px]' width={500} height={500} src={'/search/boy.png'} alt='woman iamge'></Image>
                                            </div>
                                        </div>
                                        <div className=" w-[50%] text-center  text-xl font-semibold">
                                            <h1>No user found</h1>
                                        </div>
                                    </footer>
                                </div>
                            )
                        }
                    </div>
                </div >
            </>
        )
    return (
        <></>
    )

}

export default ListOfFriends
