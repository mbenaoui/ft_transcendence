import '@/styles/globals.css'
import '@/styles/game.css'
import type { AppProps } from 'next/app'
import SideMenu from '@/components/layout/sideMenu';
import Navbar from '@/components/layout/navbar';
import React from 'react'

import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { fetchAllAmis, fetchAllUsers, fetchCurrentUser, getCurrentUser } from '@/hooks/userHooks';
import Image from 'next/image';
import { Open_Sans } from 'next/font/google'
import { userData, userProps } from '@/interface/data';
import Head from 'next/head'
// import { getBack } from '@/hooks/appContexts';
// import { fetchData } from '@/hooks/appContexts';
import { useRouter } from 'next/router';
import { Constant } from '@/constants/constant';
import { getLevel } from '@/components/game/listOfFriends';
import LoginFirstTime from '@/components/user/loginFirstTime';

const font = Open_Sans({ subsets: ['latin'] })
export interface CardInvitation {
  currentUser: userProps;
  opponent: userProps;
  handerRefuseButton: () => void;
  handerAcceptButton: () => void;
  hideRequest: boolean;
  myIdFromOpponent: Number
}
const RejectRequestComp = ({ router, opponent, rejectRequest, setrejectRequest }: { router: any, opponent: userProps, rejectRequest: boolean, setrejectRequest: (rejectRequest: boolean) => void }) => {
  return (
    <>
      {
        (rejectRequest) ? (
          <div className='w-full h-full flex justify-center items-center z-50 absolute top-0   '>
            <div className="w-full h-full absolute  bg-black opacity-10 "></div>
            <div className=" shadow-xl overflow-hidden font-sans w-[80%]  md:w-[30%] md:min-w-[400px]  max-w-[500px] h-[330px] md:h-[420px] bg-[#EEF0F6] rounded-2xl flexitems-centerjustify-around  relative">
              <div className=" relative h-1/4 w-full bg-[#205BF1] rounded-t-2xl flex justify-end items-center">
                <div className=" absolute w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full top-[55%] md:top-[50%] left-5 border-4 border-[#EEF0F6]">
                  <Image className='rounded-full bg-[#EEF0F6]' src={opponent.foto_user} fill style={{ objectFit: "cover" }} alt='user'></Image>
                </div>
              </div>
              <div className="h-2/3 w-full  space-y-4 p-2 top-6 relative">
                <div className="w-full flex items-center px-5 md:p-5 -space-x-2 md:space-x-5  ">
                  <div className="text-[#1F2025] text-xl sm:text-2xl md:text-3xl   capitalize  font-bold overflow-hidden whitespace-nowrap overflow-ellipsis w-[120px] sm:w-max">{'hamza'}</div>
                  <Image className='w-[40px] h-[40px] lg:w-[60px] lg:h-[60px]' src={'/game/grad/grad-1.svg'} width={60} height={60} alt='grad'></Image>
                </div>
                <div className="w-full   text-center text-2xl text-[#1F2025]  capitalize ">
                  <span>
                    {opponent.username} reject your request.
                  </span>
                  <Image className='ml-1 inline-block' width={20} height={20} alt='ping' src={'/icons-ping-pong-white.png'} />
                </div>
                <div className='flex justify-around items-center  w-full  pt-5'>
                  <button onClick={() => { setrejectRequest(false), router.push('/game') }} className='py-1 px-8  md:px-12 md:py-2 rounded-xl border-2  text-[#1F2025] border-[#1F2025] text-2xl font-medium'>OK</button>
                </div>
              </div>
            </div>
          </div>
        ) : null
      }
    </>
  )
}


const CardInvitation = ({ currentUser, opponent, handerRefuseButton, hideRequest, myIdFromOpponent, handerAcceptButton }: CardInvitation) => {
  return (
    <>
      {
        myIdFromOpponent === Number(currentUser.id) ?
          (
            <div className={` z-40  absolute w-full h-screen   flex justify-center items-center `}>
              <div className=" absolute w-full h-full opacity-10 bg-black"></div>
              <div className=" shadow-xl overflow-hidden font-sans w-[80%]  md:w-[40%] md:min-w-[450px]  max-w-[600px] max-h-[430px] h-1/2 bg-[#EEF0F6] rounded-2xl flexitems-centerjustify-around  relative">
                <div className=" relative h-1/4 w-full bg-[#205BF1] rounded-t-2xl flex justify-end items-center">
                  <div className="text-xl sm:text-2xl text-[#EEF0F6] p-10 relative top-1 md:top-4">
                    LEVEL:{getLevel(opponent.level)}
                  </div>
                  <div className=" absolute w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-full top-[55%] md:top-[50%] left-5 border-4 border-[#EEF0F6]">
                    <Image className='rounded-full bg-[#EEF0F6]' src={opponent.foto_user} fill style={{ objectFit: "cover" }} alt='user'></Image>
                  </div>
                </div>
                <div className="w-full  flex items-center justify-end text-lg md:text-xl pt-2 pr-4 space-x-2  md:pt-5 md:pr-10 md:space-x-5 ">
                  <div className=" text-[#4a4a4a]   bottom-2 relative  ">Won: {opponent.won ? opponent.won : 0}</div>
                  <div className=" text-[#4a4a4a]  bottom-2 relative ">Lost: {opponent.lost ? opponent.lost : 0}</div>
                </div>
                <div className="h-2/3 w-full  space-y-5 p-2">
                  <div className="w-full flex items-center px-5 p-5 -space-x-4 sm:space-x-2 md:space-x-3  ">
                    <div className="text-[#1F2025] text-2xl  md:text-3xl   capitalize  font-bold overflow-hidden whitespace-nowrap overflow-ellipsis w-[120px] sm:w-max">{opponent.username}</div>
                    <Image className='w-[40px] h-[40px] lg:w-[60px] lg:h-[60px]' src={'/game/grad/grad-1.svg'} width={60} height={60} alt='grad'></Image>
                  </div>
                  <div className="w-full   text-center text-2xl text-[#363636]  capitalize ">
                    <span>
                      {opponent.username} wants to play with your.
                    </span>
                    <Image className='ml-1 inline-block' width={20} height={20} alt='ping' src={'/icons-ping-pong-black.png'} />
                  </div>
                  <div className='flex justify-around items-center  w-full  text-xl pt-5  '>
                    <button onClick={handerRefuseButton} className='py-2 px-4  md:px-5 md:py-3 rounded-xl border-2  text-[#2d55ba] border-[#2d55ba] font-semibold'>Refuse</button>
                    <button onClick={handerAcceptButton} className='py-2 px-4  md:px-5 md:py-3 rounded-xl bg-[#205BF1] text-[#EEF0F6] font-semibold'>Accept</button>
                  </div>
                </div>
              </div>
            </div>)
          : null
      }
    </>
  )
}
export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isSideMenuVisible, setIsSideMenuVisible] = useState(!router.asPath.startsWith('/auth/login'))
  const [isSideMenuVisible2, setisSideMenuVisible2] = useState(!router.asPath.startsWith('/register'))
  const [isSideMenuVisible3, setisSideMenuVisible3] = useState(!router.asPath.startsWith(`/enter-2fa/`))
  const [connect, setConnect] = useState(false);
  // const [hiddenFirsttm]
  const [socket, setSocket] = useState<any>();
  const [hideRequest, sethideRequest] = useState<boolean>(true);
  const [myIdFromOpponent, setmyIdFromOpponent] = useState<number>(-2);
  const [room, setRoom] = useState('')
  const [opponent, setopponent] = useState<userProps>(userData);
  const [rejectRequest, setrejectRequest] = useState(false)
  const [login, setlogin] = useState<boolean>(false)
  const [onlineUsersss, setOnlineUsersss] = useState<Array<number>>([]);
  const [amis, setAmis] = useState<any>([])
  const [users, setUsers] = useState<Array<any>>([]);
  const [currentUser, setCurrentUser] = useState<userProps>(userData);
  const [isLogin, setIsLogin] = useState(false)
  const [first_login, setfrist_login] = useState(false)
  const routerHelp = useRef('')
  const [loginFirsTm, setloginFirsTm] = useState(false)
  fetchAllUsers({ setUsers, currentUser })
  fetchAllAmis({ setAmis, currentUser })

  useEffect(() => {
    if (isSideMenuVisible2 && isSideMenuVisible3) {
      (
        async () => {
          try {
            const response = await fetch(`${Constant.API_URL}/auth/user`, {
              credentials: 'include',
            });
            if (!response.ok)
              return
            if (response.status != 200 && response.status != 201) {
              router.push('/auth/login');
              return;
            }
            else {
              const content = await response.json();
              setCurrentUser(content);
              setIsLogin(true)
              setfrist_login(content.first_login)
            }
          } catch (error) {
          }
        }
      )();
    }
  }, []);
  const [opponentSocket, setopponentSocket] = useState()
  useEffect(() => {
    try {
      const newSocket = io(`${Constant.API_URL}/OnlineGateway`, {
        transports: ["websocket"],
        withCredentials: true
      });
      setSocket(newSocket);
      newSocket?.on("updateOnlineUsers", (amisOnline: any) => {
        setOnlineUsersss(amisOnline)
      });
      newSocket?.on("areYouReady", ({ opponentSocket, OpponentId, currentPlayer, room }: { opponentSocket: any, OpponentId: string, currentPlayer: userProps, room: string }) => {
        setRoom(room)
        setopponentSocket(opponentSocket)
        setmyIdFromOpponent(Number(OpponentId))
        setopponent(currentPlayer);
        sethideRequest(true)
      });
      newSocket?.on("rejectRequest", async ({ _opponent, _room }: { _opponent: userProps, _room: string }) => {
        const user = await getCurrentUser()
        if (user.room == _room) {
          setrejectRequest(true)
          setopponent(_opponent)
        }
      })
      newSocket?.on("rejectAcceptRequesthidden", () => {
        sethideRequest((prev) => !prev)
        setmyIdFromOpponent(-2)
      })
      return () => {
        newSocket?.disconnect();
      };
    }
    catch (error) {
    }
  }, [connect, currentUser]);

  const modifiedPageProps = {
    ...pageProps,
    onlineUsersss: onlineUsersss,
    currentUser: currentUser,
    users: users,
    amis: amis,
    socket: socket,
  };

  const handerRefuseButton = async () => {
    socket?.emit('rejectAcceptRequesthidden', { currentUser: currentUser });
    setRoom('')
    sethideRequest((prev) => !prev)
    setmyIdFromOpponent(-2)
    socket.emit("rejectRequest", { currentUser, opponent, opponentSocket, room });
  }

  const handerAcceptButton = async () => {
    socket?.emit('userjointToGame', { userId: currentUser.id })
    socket?.emit('rejectAcceptRequesthidden', { currentUser: currentUser });
    socket?.emit('deleteFromsearchForOpponent');
    setmyIdFromOpponent(-2)
    sethideRequest((prev) => !prev)
    try {

      const response = await fetch(`${Constant.API_URL}/game/room/${currentUser.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'room': room,
          'opponentId': Number(opponent.id),
        }),
        credentials: 'include',
      });
      if (response.ok)
        router.push('/game/online?settings=true')
    } catch (error) {

    }
  }
  const [path, setpath] = useState('')
  const [refreshData, setRefreshData] = useState<boolean>(false)
  const [oldPath, setOldPath] = useState('')
  useEffect(() => {
    (
      async () => {
        try {

          const response = await fetch(`${Constant.API_URL}/auth/user`, {
            credentials: 'include',
          });
          if (response.status == 200 || response.status == 201) {
            const content = await response.json();
            setCurrentUser(content);
            setIsLogin(true)
            setfrist_login(content.first_login)
          }
          else if (router.asPath != '/register' && !router.asPath.startsWith('/enter-2fa/') && router.asPath != '/auth/login')
            router.push('/auth/login')
        } catch (error) {

        }
      }
    )();
  }, [login, first_login]);

  useEffect(() => {
    routerHelp.current = router.asPath
    if ((oldPath == '/game/online?search=true' && router.asPath != '/game/online?settings=true') || oldPath == '/game/online?settings=true')
      socket?.emit('withdrawalFromMatching')
    if ((oldPath == '/game/online?settings=true' && router.asPath != '/game/online?play=true') ||
      (oldPath == '/game/online?search=true' && router.asPath != '/game/online?settings=true'))
      socket?.emit('DeleteuserFromGame', { userId: currentUser.id })
    if (oldPath == '/auth/login' || oldPath.startsWith('/enter-2fa'))
      setlogin((pr) => !pr)
    if (router.route != '/search')
      setpath(router.route)
    if (oldPath != '/game/online?settings=true' && router.asPath == '/game/online?play=true')
      router.push('/game')
    if ((oldPath == '/auth/login' || oldPath.startsWith('/enter-2fa')) && router.asPath == '/')
      setConnect((pr) => !pr)
    setOldPath(router.asPath)
    setIsSideMenuVisible(router.asPath != '/auth/login')
    setisSideMenuVisible2(router.asPath != '/register')
    setisSideMenuVisible3(!router.asPath.startsWith('/enter-2fa'))
  }, [router])
  const itv = isSideMenuVisible && isSideMenuVisible2 && isSideMenuVisible3
  return (
    <>
      {
        first_login && (
          <div className=' absolute  w-full h-screen z-50 flex justify-center items-center '>
            <div className="w-full h-full absolute     bg-slate-600 opacity-30 "></div>
            <LoginFirstTime setfrist_login={setfrist_login} currentUser={currentUser}></LoginFirstTime>
            {/* <LoginFirstTime setfrist_login={setfrist_login} loginFirsTm={loginFirsTm} setloginFirsTm={setloginFirsTm}  currentUser={currentUser}></LoginFirstTime> */}
          </div>
        )
      }
      <RejectRequestComp router={router} opponent={opponent} rejectRequest={rejectRequest} setrejectRequest={setrejectRequest} />
      <CardInvitation currentUser={currentUser} opponent={opponent} handerRefuseButton={handerRefuseButton}
        hideRequest={hideRequest} myIdFromOpponent={myIdFromOpponent} handerAcceptButton={handerAcceptButton} />
      <div className={`${font.className}   font-medium ${rejectRequest || myIdFromOpponent === Number(currentUser.id) ? 'blur-[0.7px]' : ''}`}>
        {
          isLogin && isSideMenuVisible && isSideMenuVisible2 && isSideMenuVisible3 &&
          <>
            <Navbar currentUser={currentUser} users={users} amis={amis} onlineUsersss={onlineUsersss} socket={socket} />
            <SideMenu />
          </>
        }
        <div
          className={`${isSideMenuVisible && isSideMenuVisible2 && isSideMenuVisible3 ? 'home' : ''}`}
          hidden={(!isLogin && isSideMenuVisible && isSideMenuVisible2 && isSideMenuVisible3)}
        >
          <Component
            {...modifiedPageProps}
          >
          </Component>
        </div>
      </div >
    </>
  )
}