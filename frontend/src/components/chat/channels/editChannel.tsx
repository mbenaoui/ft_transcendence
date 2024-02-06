import { channelProps, participantsProps, userProps } from '@/interface/data'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Constant } from '@/constants/constant'
import AddPeople from './addPeople'
import index from '@/pages/chat'
import { Socket } from 'socket.io-client'
import { useRouter } from 'next/router'

const EditChannel = ({ chatSocket, setMyStatusInRoom, currentUser, users, Room }: { chatSocket: Socket, setMyStatusInRoom?: (value: participantsProps) => void | undefined, currentUser: userProps, users: userProps[], Room: channelProps }) => {
    const [click, setClick] = useState<number>(0)
    const [type, setType] = useState(Room.type)
    const [Room1, setRoom1] = useState<channelProps>(Room);
    const [password, setPassword] = useState(Room.password);
    const [participants, setParticipants] = useState<participantsProps[]>([])
    const [participant, setParticipant] = useState<participantsProps>()
    const [userStatusRoom, setUserStatusRoom] = useState<participantsProps>()
    const [error, seterror] = useState(false);
    const [leavingRoom, setLeavingRoom] = useState(false);
    const [select, setSelect] = useState(false)
    const [people, setPeople] = useState<number[]>([])
    const [duration, setDuration] = useState<string>('1day')
    const router = useRouter();

    const handlTime = (item: string) => {
        const dateObject = new Date(item);

        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1;
        const day = dateObject.getDate();
        const hours = dateObject.getHours();
        const minutes = dateObject.getMinutes();
        return <div className=" text-gray-500 text-lg font-medium font-['Satoshi'] ">Return in {month}-{day} | {hours}:{minutes}</div>
    }

    useEffect(() => {
        if (Room.id) {
            (
                async () => {
                    try {
                        const response = await fetch(`${Constant.API_URL}/chat/allUsersChannel/${Room.id}`, {
                            credentials: 'include',
                        })
                        const content = await response.json();
                        setParticipants(Array.from(content))
                    } catch (error) {

                    }
                    setLeavingRoom(false)
                }
            )();
        }
    }, [Room, click, leavingRoom, people]);



    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`${Constant.API_URL}/chat/OneChannel/${Room.id}`, {
                        credentials: 'include',
                    })
                    const content = await response.json();
                    setRoom1(content)
                } catch (error) {

                }
            }
        )();
    }, [click, Room]);
    useEffect(() => {
        setClick(0);
        users.map((item: userProps) => {
            item.flag = false
        })
    }, [Room]);

    useEffect(() => {

        setType(Room1.type);
        setPassword(Room1.password);
        seterror(false)
        if (Room && participants) {
            participants?.map((item: participantsProps) => {
                if (item.id == currentUser.id) {
                    setUserStatusRoom(item);
                    if (setMyStatusInRoom)
                        setMyStatusInRoom(item);
                }
            })
        }
    }, [Room, click, participants]);



    const handlParticipants = async (item: string) => {
        try {
            const resp = await fetch(`${Constant.API_URL}/chat/setAdmin/${Room.id}/${participant?.id}/${item}/${duration}`, {
                method: 'POST',
                credentials: 'include',
            })
            if (resp.ok) {
                chatSocket.emit('updateConv', { participantId: participant?.id })
            }
        } catch (error) {

        }
        setClick(0)
    }

    const handl1 = (item: any) => {
        setClick(2)
        setParticipant(item)
    }
    const upadategroup = async () => {


        try {
            if (type == "protected" && Room1.type == "public" && !password) {

                seterror(true)
            }
            else {

                const response = await fetch(`${Constant.API_URL}/chat/upadteChannel/${Room.id}/${type}/${password}`, {
                    credentials: 'include',
                })
                const content = await response.json();
                if (response.status == 200) {

                    setClick(0);
                }
                else {
                    seterror(true)
                }
            }
        } catch (error) {

        }
    };

    const handlSelect = (item: userProps[], s: boolean, index: number) => {
        item[index].flag = s
        if (select == true)
            setSelect(false)
        else
            setSelect(true)
    }

    useEffect(() => {
        setPeople([])
        users.map((item: userProps) => {
            if (item.flag)
                setPeople(prevPeople => [...prevPeople, item.id]);
        })

    }, [click])

    const addUserToRoom = async () => {

        await fetch(`${Constant.API_URL}/chat/addParticipants/${Room.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "people": people
            }),
            credentials: 'include',
        });
        setPeople([])
        users.map((item: userProps) => {
            item.flag = false
        })
        try {
            const response = await fetch(`${Constant.API_URL}/chat/allUsersChannel/${Room.id}`, {
                credentials: 'include',
            })
            const content = await response.json();
            setParticipants(Array.from(content))
        } catch (error) {

        }
        setLeavingRoom(false)
    }

    const handlRemove = async () => {
        const response = await fetch(`${Constant.API_URL}/chat/removeChannel/${Room.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (response.ok) {
            router.push('/');
        }
    }

    return (
        <>
            {Room.id && <div className={`  bg-gray-f100  ${click != 0 ? 'blur-[1.2px]' : null}   w-full h-full  rounded-xl p-3  flex justify-start items-start`}>
                <div className="w-full h-full flex-col justify-center items-center">
                    <div className="flex-col justify-start items-center flex ">
                        <div className={`flex justify-center items-center w-36 h-36 rounded-full  border-2 border-sky-500 ${Room.type == 'public' && ' bg-green-300'}  ${Room.type == 'private' && ' bg-red-400'}  ${Room.type == 'protected' && ' bg-yellow-400'}`} >
                            <h1 className='flex items-center justify-center text-[90px] font-bold text-white'>{Room?.name[0].toUpperCase()}</h1>
                        </div>
                        <div className='flex items-center bg-slatfe-200 justify-center w-full'>
                            <div className=" max-w-[200px]  w-auto h-14  text-center  break-all   text-xl flex items-center  ">
                                <h1 className="text-zinc-900 ">{Room?.name}</h1>
                            </div>
                            {userStatusRoom?.isOwner && <button onClick={() => setClick(5)} className="mt-2f ml-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 18 20" fill="none">
                                    <path d="M7 16C7.26522 16 7.51957 15.8946 7.70711 15.7071C7.89464 15.5196 8 15.2652 8 15V9C8 8.73478 7.89464 8.48043 7.70711 8.29289C7.51957 8.10536 7.26522 8 7 8C6.73478 8 6.48043 8.10536 6.29289 8.29289C6.10536 8.48043 6 8.73478 6 9V15C6 15.2652 6.10536 15.5196 6.29289 15.7071C6.48043 15.8946 6.73478 16 7 16ZM17 4H13V3C13 2.20435 12.6839 1.44129 12.1213 0.87868C11.5587 0.316071 10.7956 0 10 0H8C7.20435 0 6.44129 0.316071 5.87868 0.87868C5.31607 1.44129 5 2.20435 5 3V4H1C0.734784 4 0.48043 4.10536 0.292893 4.29289C0.105357 4.48043 0 4.73478 0 5C0 5.26522 0.105357 5.51957 0.292893 5.70711C0.48043 5.89464 0.734784 6 1 6H2V17C2 17.7956 2.31607 18.5587 2.87868 19.1213C3.44129 19.6839 4.20435 20 5 20H13C13.7956 20 14.5587 19.6839 15.1213 19.1213C15.6839 18.5587 16 17.7956 16 17V6H17C17.2652 6 17.5196 5.89464 17.7071 5.70711C17.8946 5.51957 18 5.26522 18 5C18 4.73478 17.8946 4.48043 17.7071 4.29289C17.5196 4.10536 17.2652 4 17 4ZM7 3C7 2.73478 7.10536 2.48043 7.29289 2.29289C7.48043 2.10536 7.73478 2 8 2H10C10.2652 2 10.5196 2.10536 10.7071 2.29289C10.8946 2.48043 11 2.73478 11 3V4H7V3ZM14 17C14 17.2652 13.8946 17.5196 13.7071 17.7071C13.5196 17.8946 13.2652 18 13 18H5C4.73478 18 4.48043 17.8946 4.29289 17.7071C4.10536 17.5196 4 17.2652 4 17V6H14V17ZM11 16C11.2652 16 11.5196 15.8946 11.7071 15.7071C11.8946 15.5196 12 15.2652 12 15V9C12 8.73478 11.8946 8.48043 11.7071 8.29289C11.5196 8.10536 11.2652 8 11 8C10.7348 8 10.4804 8.10536 10.2929 8.29289C10.1054 8.48043 10 8.73478 10 9V15C10 15.2652 10.1054 15.5196 10.2929 15.7071C10.4804 15.8946 10.7348 16 11 16Z" fill="black" />
                                </svg>
                            </button>}
                        </div>
                        <div className=" max-w-[340px]  w-auto h-14 p-3  break-all   text-md overflow-y-scroll scrollbar-hide  ">
                            <p className="whitespace-normal text-gray-400"> {Room.description}</p>
                        </div>

                        {(Room?.type == 'private' && (userStatusRoom?.isAdmin)) && <div className=" bg-white w-full flex flex-col justify-center items-center rounded-xl border-2 border-sky-400 mt-2 p-2">
                            <div className="w-full flex">
                                <h2 className="w-full text-lg font-bold font-mono ml-2">Add People</h2>
                                <div className="w-full flex justify-end">
                                    {people.length != 0 && <button onClick={addUserToRoom} className='flex justify-end hover:scale-110 duration-300'><svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 20 20" fill="none">
                                        <path d="M12.72 6.79L8.43001 11.09L6.78 9.44C6.69036 9.33532 6.58004 9.2503 6.45597 9.19027C6.33191 9.13025 6.19678 9.09652 6.05906 9.0912C5.92134 9.08588 5.78401 9.10909 5.65568 9.15936C5.52736 9.20964 5.41081 9.28589 5.31335 9.38335C5.2159 9.4808 5.13964 9.59735 5.08937 9.72568C5.03909 9.854 5.01589 9.99133 5.02121 10.1291C5.02653 10.2668 5.06026 10.4019 5.12028 10.526C5.1803 10.65 5.26532 10.7604 5.37 10.85L7.72 13.21C7.81344 13.3027 7.92426 13.376 8.0461 13.4258C8.16794 13.4755 8.2984 13.5008 8.43001 13.5C8.69234 13.4989 8.94374 13.3947 9.13 13.21L14.13 8.21C14.2237 8.11704 14.2981 8.00644 14.3489 7.88458C14.3997 7.76272 14.4258 7.63201 14.4258 7.5C14.4258 7.36799 14.3997 7.23728 14.3489 7.11542C14.2981 6.99356 14.2237 6.88296 14.13 6.79C13.9426 6.60375 13.6892 6.49921 13.425 6.49921C13.1608 6.49921 12.9074 6.60375 12.72 6.79ZM10 0C8.02219 0 6.08879 0.58649 4.4443 1.6853C2.79981 2.78412 1.51809 4.3459 0.761209 6.17317C0.00433284 8.00043 -0.193701 10.0111 0.192152 11.9509C0.578004 13.8907 1.53041 15.6725 2.92894 17.0711C4.32746 18.4696 6.10929 19.422 8.0491 19.8079C9.98891 20.1937 11.9996 19.9957 13.8268 19.2388C15.6541 18.4819 17.2159 17.2002 18.3147 15.5557C19.4135 13.9112 20 11.9778 20 10C20 8.68678 19.7413 7.38642 19.2388 6.17317C18.7363 4.95991 17.9997 3.85752 17.0711 2.92893C16.1425 2.00035 15.0401 1.26375 13.8268 0.761205C12.6136 0.258658 11.3132 0 10 0ZM10 18C8.41775 18 6.87104 17.5308 5.55544 16.6518C4.23985 15.7727 3.21447 14.5233 2.60897 13.0615C2.00347 11.5997 1.84504 9.99113 2.15372 8.43928C2.4624 6.88743 3.22433 5.46197 4.34315 4.34315C5.46197 3.22433 6.88743 2.4624 8.43928 2.15372C9.99113 1.84504 11.5997 2.00346 13.0615 2.60896C14.5233 3.21447 15.7727 4.23984 16.6518 5.55544C17.5308 6.87103 18 8.41775 18 10C18 12.1217 17.1572 14.1566 15.6569 15.6569C14.1566 17.1571 12.1217 18 10 18Z" fill="black" />
                                    </svg></button>}
                                </div>
                            </div>
                            <div className='overflow-y-scroll bg-blfack scrollbar-hide flex bg-gdray-600 flex-row justify-start items-center flex-wrap gridx grid-cols-2x grid-flolw-colx  h-28  w-[90%] bg-slatef-400 mt-2  space-fx-0 spacfe-y-0 gap-1 bg-slatfe-700'>
                                {users.map((item, index) => (
                                    <div key={index} className=' bg-ambder-500 bord,fer border-sfky-900 rounded-md  w-auto b-black'>
                                        {
                                            item.flag &&
                                            <div className='flex  justify-center items-center   border border-sky-400 bg-sky-200 rounded-md  min-w-32f w-aufto space-x-2  h-10 p-2' key={index}>
                                                <div className="w-5 bg- h-5">
                                                    <img className="w-5 h-5 rounded-full" src={item.foto_user} />
                                                </div>
                                                <h1 className='h-6 w-auto text-sm'>{item.username}</h1>
                                                <div className=''>
                                                    <button className='' onClick={() => handlSelect(users, false, index)}  >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 180 180" fill="none">
                                                            <path d="M100.575 90.0004L132.825 57.8254C134.237 56.4131 135.031 54.4977 135.031 52.5004C135.031 50.5032 134.237 48.5877 132.825 47.1754C131.413 45.7631 129.497 44.9697 127.5 44.9697C125.503 44.9697 123.587 45.7631 122.175 47.1754L90 79.4254L57.825 47.1754C56.4128 45.7631 54.4973 44.9697 52.5 44.9697C50.5028 44.9697 48.5873 45.7631 47.175 47.1754C45.7628 48.5877 44.9693 50.5032 44.9693 52.5004C44.9693 54.4977 45.7628 56.4131 47.175 57.8254L79.425 90.0004L47.175 122.175C46.4721 122.873 45.9141 123.702 45.5333 124.616C45.1526 125.53 44.9565 126.51 44.9565 127.5C44.9565 128.491 45.1526 129.471 45.5333 130.385C45.9141 131.299 46.4721 132.128 47.175 132.825C47.8723 133.528 48.7018 134.086 49.6157 134.467C50.5296 134.848 51.5099 135.044 52.5 135.044C53.4901 135.044 54.4704 134.848 55.3844 134.467C56.2983 134.086 57.1278 133.528 57.825 132.825L90 100.575L122.175 132.825C122.872 133.528 123.702 134.086 124.616 134.467C125.53 134.848 126.51 135.044 127.5 135.044C128.49 135.044 129.47 134.848 130.384 134.467C131.298 134.086 132.128 133.528 132.825 132.825C133.528 132.128 134.086 131.299 134.467 130.385C134.847 129.471 135.044 128.491 135.044 127.5C135.044 126.51 134.847 125.53 134.467 124.616C134.086 123.702 133.528 122.873 132.825 122.175L100.575 90.0004Z" fill="#B3AEAE" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                ))
                                }
                                <div className=" bg-blagck w-fullf h-ffull mt bg-slate-f400">

                                    <button onClick={() => setClick(3)} className=''>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none">
                                            <path d="M8 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V16C4 15.7348 3.89464 15.4804 3.70711 15.2929C3.51957 15.1054 3.26522 15 3 15C2.73478 15 2.48043 15.1054 2.29289 15.2929C2.10536 15.4804 2 15.7348 2 16V19C2 19.7956 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H8C8.26522 22 8.51957 21.8946 8.70711 21.7071C8.89464 21.5196 9 21.2652 9 21C9 20.7348 8.89464 20.4804 8.70711 20.2929C8.51957 20.1054 8.26522 20 8 20ZM3 9C3.26522 9 3.51957 8.89464 3.70711 8.70711C3.89464 8.51957 4 8.26522 4 8V5C4 4.73478 4.10536 4.48043 4.29289 4.29289C4.48043 4.10536 4.73478 4 5 4H8C8.26522 4 8.51957 3.89464 8.70711 3.70711C8.89464 3.51957 9 3.26522 9 3C9 2.73478 8.89464 2.48043 8.70711 2.29289C8.51957 2.10536 8.26522 2 8 2H5C4.20435 2 3.44129 2.31607 2.87868 2.87868C2.31607 3.44129 2 4.20435 2 5V8C2 8.26522 2.10536 8.51957 2.29289 8.70711C2.48043 8.89464 2.73478 9 3 9ZM19 2H16C15.7348 2 15.4804 2.10536 15.2929 2.29289C15.1054 2.48043 15 2.73478 15 3C15 3.26522 15.1054 3.51957 15.2929 3.70711C15.4804 3.89464 15.7348 4 16 4H19C19.2652 4 19.5196 4.10536 19.7071 4.29289C19.8946 4.48043 20 4.73478 20 5V8C20 8.26522 20.1054 8.51957 20.2929 8.70711C20.4804 8.89464 20.7348 9 21 9C21.2652 9 21.5196 8.89464 21.7071 8.70711C21.8946 8.51957 22 8.26522 22 8V5C22 4.20435 21.6839 3.44129 21.1213 2.87868C20.5587 2.31607 19.7956 2 19 2ZM16 12C16 11.7348 15.8946 11.4804 15.7071 11.2929C15.5196 11.1054 15.2652 11 15 11H13V9C13 8.73478 12.8946 8.48043 12.7071 8.29289C12.5196 8.10536 12.2652 8 12 8C11.7348 8 11.4804 8.10536 11.2929 8.29289C11.1054 8.48043 11 8.73478 11 9V11H9C8.73478 11 8.48043 11.1054 8.29289 11.2929C8.10536 11.4804 8 11.7348 8 12C8 12.2652 8.10536 12.5196 8.29289 12.7071C8.48043 12.8946 8.73478 13 9 13H11V15C11 15.2652 11.1054 15.5196 11.2929 15.7071C11.4804 15.8946 11.7348 16 12 16C12.2652 16 12.5196 15.8946 12.7071 15.7071C12.8946 15.5196 13 15.2652 13 15V13H15C15.2652 13 15.5196 12.8946 15.7071 12.7071C15.8946 12.5196 16 12.2652 16 12ZM21 15C20.7348 15 20.4804 15.1054 20.2929 15.2929C20.1054 15.4804 20 15.7348 20 16V19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H16C15.7348 20 15.4804 20.1054 15.2929 20.2929C15.1054 20.4804 15 20.7348 15 21C15 21.2652 15.1054 21.5196 15.2929 21.7071C15.4804 21.8946 15.7348 22 16 22H19C19.7956 22 20.5587 21.6839 21.1213 21.1213C21.6839 20.5587 22 19.7956 22 19V16C22 15.7348 21.8946 15.4804 21.7071 15.2929C21.5196 15.1054 21.2652 15 21 15Z" fill="#3AB8FF" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>}
                    </div>
                    <div className="flex flex-col overflow-y-scroll scrollbar-hide sm:h-[145px] h-[140px] lg:h-[330px]  bg-slatje-500 mt-4">
                        {
                            participants.map((item: participantsProps, index) => (
                                <div key={index}>
                                    {item.isOwner && <div className='w-full flex  bg-blue-400 rounded-full mt-2 items-center'>
                                        <img className='w-10 h-10 rounded-full' src={item.foto_user} />
                                        <h1 className='flex items-center text-xl font-bold font-mono text-gray-100 ml-2'>{item.username}</h1>
                                        <p className='w-full ml-1'>(Owner)</p>
                                        {item.id == currentUser.id && Room.type != 'private' && <button onClick={() => setClick(1)} className='flex w-full justify-end items-center mr-2'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M21.71 15.5799L17.19 11.0699C17.2846 10.6093 17.3315 10.1401 17.33 9.66988C17.3296 8.38054 17.0042 7.11208 16.3839 5.98177C15.7636 4.85145 14.8683 3.89576 13.7809 3.20303C12.6934 2.51029 11.4489 2.10287 10.1623 2.01842C8.87572 1.93398 7.58862 2.17523 6.41995 2.71988C6.27189 2.78752 6.14258 2.89028 6.04324 3.01924C5.94391 3.1482 5.87756 3.29946 5.84995 3.45988C5.82246 3.61827 5.83355 3.78095 5.88229 3.93414C5.93103 4.08733 6.01599 4.22651 6.12995 4.33988L10.48 8.67988L8.67995 10.4799L4.33995 6.12988C4.22562 6.01769 4.08601 5.9346 3.93287 5.88761C3.77972 5.84062 3.61754 5.83112 3.45995 5.85988C3.30053 5.88648 3.14994 5.95132 3.02106 6.04885C2.89218 6.14638 2.78886 6.27369 2.71995 6.41988C2.17348 7.59239 1.93243 8.88406 2.01924 10.1747C2.10606 11.4654 2.5179 12.7132 3.21647 13.802C3.91503 14.8907 4.87762 15.7851 6.0147 16.4019C7.15177 17.0188 8.42638 17.338 9.71995 17.3299C10.1902 17.3314 10.6593 17.2845 11.12 17.1899L15.63 21.7099C15.7229 21.8036 15.8335 21.878 15.9554 21.9288C16.0772 21.9795 16.2079 22.0057 16.34 22.0057C16.472 22.0057 16.6027 21.9795 16.7245 21.9288C16.8464 21.878 16.957 21.8036 17.05 21.7099C17.1437 21.6169 17.2181 21.5063 17.2688 21.3845C17.3196 21.2626 17.3458 21.1319 17.3458 20.9999C17.3458 20.8679 17.3196 20.7372 17.2688 20.6153C17.2181 20.4934 17.1437 20.3828 17.05 20.2899L12.15 15.3899C12.0275 15.2682 11.8757 15.1804 11.7092 15.1348C11.5427 15.0893 11.3673 15.0876 11.2 15.1299C10.7171 15.2592 10.2198 15.3264 9.71995 15.3299C8.972 15.3365 8.23014 15.195 7.53709 14.9137C6.84405 14.6323 6.21353 14.2166 5.68184 13.6905C5.15016 13.1644 4.72783 12.5383 4.43917 11.8482C4.15052 11.1582 4.00124 10.4179 3.99995 9.66988C3.99866 9.3349 4.02542 9.0004 4.07995 8.66988L7.99995 12.5999C8.09292 12.6936 8.20352 12.768 8.32538 12.8188C8.44724 12.8695 8.57794 12.8957 8.70995 12.8957C8.84197 12.8957 8.97267 12.8695 9.09453 12.8188C9.21639 12.768 9.32699 12.6936 9.41995 12.5999L12.6 9.38988C12.7802 9.20342 12.8809 8.95422 12.8809 8.69488C12.8809 8.43554 12.7802 8.18635 12.6 7.99988L8.70995 4.07988C9.04054 4.0259 9.37499 3.99914 9.70995 3.99988C11.212 4.00253 12.6516 4.60108 13.7128 5.66412C14.774 6.72716 15.37 8.16784 15.37 9.66988C15.3665 10.1697 15.2993 10.6671 15.17 11.1499C15.1276 11.3172 15.1293 11.4926 15.1749 11.6591C15.2204 11.8256 15.3083 11.9774 15.43 12.0999L20.33 16.9999C20.5183 17.1882 20.7737 17.294 21.04 17.294C21.3063 17.294 21.5616 17.1882 21.75 16.9999C21.9383 16.8116 22.044 16.5562 22.044 16.2899C22.044 16.0236 21.9383 15.7682 21.75 15.5799H21.71Z" fill="black" />
                                        </svg></button>}
                                    </div>}
                                </div>
                            ))
                        }

                        {
                            participants.map((item: participantsProps, index) => (
                                <div key={index}>
                                    {item.isAdmin && !item.isOwner && <div className='w-full flex items-center bg-blue-300 rounded-full mt-2'>
                                        <img className='w-10 h-10 rounded-full' src={item.foto_user} />
                                        <h1 className='flex items-center font-semibold text-gray-800 ml-2'>{item.username}</h1>
                                        <p className='w-full ml-1'>(Admin)</p>
                                        {userStatusRoom?.isOwner && currentUser.id == userStatusRoom.id && <button onClick={() => handl1(item)} className='flex w-full justify-end mr-2'> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M3 8H21C21.2652 8 21.5196 7.89464 21.7071 7.70711C21.8946 7.51957 22 7.26522 22 7C22 6.73478 21.8946 6.48043 21.7071 6.29289C21.5196 6.10536 21.2652 6 21 6H3C2.73478 6 2.48043 6.10536 2.29289 6.29289C2.10536 6.48043 2 6.73478 2 7C2 7.26522 2.10536 7.51957 2.29289 7.70711C2.48043 7.89464 2.73478 8 3 8ZM21 16H3C2.73478 16 2.48043 16.1054 2.29289 16.2929C2.10536 16.4804 2 16.7348 2 17C2 17.2652 2.10536 17.5196 2.29289 17.7071C2.48043 17.8946 2.73478 18 3 18H21C21.2652 18 21.5196 17.8946 21.7071 17.7071C21.8946 17.5196 22 17.2652 22 17C22 16.7348 21.8946 16.4804 21.7071 16.2929C21.5196 16.1054 21.2652 16 21 16ZM21 11H3C2.73478 11 2.48043 11.1054 2.29289 11.2929C2.10536 11.4804 2 11.7348 2 12C2 12.2652 2.10536 12.5196 2.29289 12.7071C2.48043 12.8946 2.73478 13 3 13H21C21.2652 13 21.5196 12.8946 21.7071 12.7071C21.8946 12.5196 22 12.2652 22 12C22 11.7348 21.8946 11.4804 21.7071 11.2929C21.5196 11.1054 21.2652 11 21 11Z" fill="black" />
                                        </svg></button>}
                                    </div>}
                                </div>
                            ))
                        }
                        {
                            participants.map((item: participantsProps, index) => (
                                <div key={index}>
                                    {!item.isOwner && !item.isAdmin && <div className='w-full flex items-center  bg-blue-100 rounded-full mt-2'>
                                        <img className='w-10 h-10 rounded-full' src={item.foto_user} />
                                        <h1 className='flex items-center text-gray-800 ml-2'>{item.username}</h1>
                                        {userStatusRoom?.isAdmin && currentUser.id == userStatusRoom.id && <button onClick={() => handl1(item)} className='flex w-full justify-end mr-2'> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path d="M3 8H21C21.2652 8 21.5196 7.89464 21.7071 7.70711C21.8946 7.51957 22 7.26522 22 7C22 6.73478 21.8946 6.48043 21.7071 6.29289C21.5196 6.10536 21.2652 6 21 6H3C2.73478 6 2.48043 6.10536 2.29289 6.29289C2.10536 6.48043 2 6.73478 2 7C2 7.26522 2.10536 7.51957 2.29289 7.70711C2.48043 7.89464 2.73478 8 3 8ZM21 16H3C2.73478 16 2.48043 16.1054 2.29289 16.2929C2.10536 16.4804 2 16.7348 2 17C2 17.2652 2.10536 17.5196 2.29289 17.7071C2.48043 17.8946 2.73478 18 3 18H21C21.2652 18 21.5196 17.8946 21.7071 17.7071C21.8946 17.5196 22 17.2652 22 17C22 16.7348 21.8946 16.4804 21.7071 16.2929C21.5196 16.1054 21.2652 16 21 16ZM21 11H3C2.73478 11 2.48043 11.1054 2.29289 11.2929C2.10536 11.4804 2 11.7348 2 12C2 12.2652 2.10536 12.5196 2.29289 12.7071C2.48043 12.8946 2.73478 13 3 13H21C21.2652 13 21.5196 12.8946 21.7071 12.7071C21.8946 12.5196 22 12.2652 22 12C22 11.7348 21.8946 11.4804 21.7071 11.2929C21.5196 11.1054 21.2652 11 21 11Z" fill="black" />
                                        </svg></button>}
                                    </div>}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>}
            {

                click != 0 && <div className='h-full w-[90%]  flex-col  flex z-40'>
                    {
                        click == 1 && <div className='h-[280px] bg-white p-2 -mt-[160px] lg:-mt-[355px]'>
                            <div className=' w-full mr-2 mte-1 h-10 flex justify-end items-center'>
                                <button onClick={() => setClick(0)} >
                                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="22" height="22" viewBox="0 0 30 30">
                                        <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className=' w-full h-full flex justify-center'>

                                {
                                    Room1.type == "public" && <div className=' flex flex-col bg-whiwte fledx justify-center items-center'>
                                        <label className="block mb-2 text-sm font-black text-gray-900 dark:text-white">Choose Type group</label>
                                        <select onChange={(e) => setType(e.target.value)} id="small" className="block  w-28 p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            {/* <option selected>Choose Type group</option> */}
                                            <option value="public">Public</option>
                                            <option value="protected">Protected</option>
                                        </select>
                                        {/* <div> */}

                                        {
                                            type == 'protected' &&
                                            <div className='-mt-6'>

                                                <div className="mbw-6 flex flex-col w-full h-16 justify-center items-center space-sy-2">
                                                    {

                                                        !error && <label htmlFor="password" className=" text-sm  font-black mt-6 text-gray-900 dark:text-white">Password</label>
                                                    }
                                                    {

                                                        error && <label htmlFor="password" className=" text-sm  font-black mt-6 text-red-500 dadrk:text-white">Password</label>
                                                    }

                                                    {/* <label htmlFor="password" className=" text-sm  font-black mt-6 text-gray-900 dark:text-white">Password</label> */}
                                                    <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" className={`bg-gray-50 border ml-1 mt-1 {${error ? 'text-red-600 border-red-500' : 'text-gray-900 border-gray-300'} text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  w-28 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`} placeholder={`${error ? "You must password" : "•••••••••"} `} required />
                                                </div>
                                                {/* <div className="mb-6 flex flex-row w-full h-16 justify-center items-center space-x-">
                                            <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                                            <input type="password" id="confirm_password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
                                        </div> */}
                                            </div>
                                            // <label className='mt-2 '>
                                            //     Password:
                                            //     <input required type="password" className=' bg-blue-500' value={password} onChange={(e) => setPassword(e.target.value)} />
                                            // </label>
                                        }
                                        <div className=' w-full mt-6  ml-2 items-center flex justify-center '>

                                            <button type="submit" onClick={() => upadategroup()} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-30  px-5 py-2.5 text-center dark:bg-blue-600 justify-center items-center flex dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                                        </div>
                                        {/* </div> */}


                                    </div>

                                }
                                {
                                    Room1.type == "protected" && <div className=' flex flex-col bg-whiwte fledx justify-center items-center'>
                                        <label className="block mb-2 text-sm font-black text-gray-900 dark:text-white">Choose Type group</label>
                                        <select onChange={(e) => setType(e.target.value)} id="small" className="block  w-28 p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                            {/* <option selected>Choose Type group</option> */}
                                            <option value="protected">Protected</option>
                                            <option value="public">Public</option>
                                        </select>
                                        {/* <div> */}

                                        {
                                            Room1.type == 'protected' && type != "public" &&
                                            <div className='-mt-6'>

                                                <div className="mbw-6 flex flex-col w-full h-16 justify-center items-center space-sy-2">
                                                    <label htmlFor="password" className=" text-sm  font-black mt-6 text-gray-900 dark:text-white">Password</label>
                                                    <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" className={`bg-gray-50 border ml-1 mt-1  {${error ? 'text-red-600 border-red-500' : 'text-gray-900 border-gray-300'} text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block  w-28 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`} placeholder={`${error ? "You must password" : "•••••••••"} `} required />
                                                </div>
                                                {/* <div className="mb-6 flex flex-row w-full h-16 justify-center items-center space-x-">
                                            <label htmlFor="confirm_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
                                            <input type="password" id="confirm_password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="•••••••••" required />
                                        </div> */}
                                            </div>
                                        }
                                        <div className=' w-full mt-6 items-center ml-2 flex justify-center '>

                                            <button type="submit" onClick={() => upadategroup()} className="text-white bg-blue-700 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-30  px-5 py-2.5 text-center dark:bg-blue-600 justify-center items-center flex dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                                        </div>
                                        {/* </div> */}
                                    </div>
                                }
                            </div>
                        </div>
                    }

                    {
                        click == 2 && <div className='w-full flex flex-col h-auto bg-white p-2 -mt-[160px] lg:-mt-[355px] rounded-xl'>
                            <div className='w-full flex bg-slfate-700'>
                                <div className="w-full flex justify-centefr gap-1 ">
                                    <img className='w-10 h-10 rounded-full' src={participant?.foto_user} />
                                    <h1 className='text-blue-800 font-mono text-xl flex items-center'>{participant?.username}</h1>
                                </div>
                                <div className="flex justify-end items-center w-full">
                                    <button className='-mt-2' onClick={() => setClick(0)} >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" fill="none">
                                            <path d="M13.71 10.71C13.801 10.6149 13.8724 10.5028 13.92 10.38C14.02 10.1365 14.02 9.86347 13.92 9.62C13.8724 9.49725 13.801 9.38511 13.71 9.29L10.71 6.29C10.5217 6.1017 10.2663 5.99591 10 5.99591C9.7337 5.99591 9.47831 6.1017 9.29 6.29C9.1017 6.47831 8.99591 6.7337 8.99591 7C8.99591 7.26631 9.1017 7.5217 9.29 7.71L10.59 9H7C6.73479 9 6.48043 9.10536 6.2929 9.2929C6.10536 9.48043 6 9.73479 6 10C6 10.2652 6.10536 10.5196 6.2929 10.7071C6.48043 10.8946 6.73479 11 7 11H10.59L9.29 12.29C9.19628 12.383 9.12188 12.4936 9.07111 12.6154C9.02034 12.7373 8.99421 12.868 8.99421 13C8.99421 13.132 9.02034 13.2627 9.07111 13.3846C9.12188 13.5064 9.19628 13.617 9.29 13.71C9.38297 13.8037 9.49357 13.8781 9.61543 13.9289C9.73729 13.9797 9.86799 14.0058 10 14.0058C10.132 14.0058 10.2627 13.9797 10.3846 13.9289C10.5064 13.8781 10.617 13.8037 10.71 13.71L13.71 10.71ZM20 10C20 8.02219 19.4135 6.08879 18.3147 4.4443C17.2159 2.79981 15.6541 1.51809 13.8268 0.761209C11.9996 0.00433284 9.98891 -0.193701 8.0491 0.192152C6.10929 0.578004 4.32746 1.53041 2.92894 2.92894C1.53041 4.32746 0.578004 6.10929 0.192152 8.0491C-0.193701 9.98891 0.00433284 11.9996 0.761209 13.8268C1.51809 15.6541 2.79981 17.2159 4.4443 18.3147C6.08879 19.4135 8.02219 20 10 20C12.6522 20 15.1957 18.9464 17.0711 17.0711C18.9464 15.1957 20 12.6522 20 10V10ZM2 10C2 8.41775 2.4692 6.87104 3.34825 5.55544C4.2273 4.23985 5.47673 3.21447 6.93854 2.60897C8.40035 2.00347 10.0089 1.84504 11.5607 2.15372C13.1126 2.4624 14.538 3.22433 15.6569 4.34315C16.7757 5.46197 17.5376 6.88743 17.8463 8.43928C18.155 9.99113 17.9965 11.5997 17.391 13.0615C16.7855 14.5233 15.7602 15.7727 14.4446 16.6518C13.129 17.5308 11.5823 18 10 18C7.87827 18 5.84344 17.1572 4.34315 15.6569C2.84286 14.1566 2 12.1217 2 10V10Z" fill="#3D64CA" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className=" bg-slate-4f00 flex flex-col justify-center items-center gap-4 mt-3">
                                <button className=' rounded-full text-white font-bold hover:scale-105 duration-300 font-mono h-8 w-full  bg-sky-500 ' onClick={() => handlParticipants('kick')}>Remove</button>
                                {userStatusRoom?.isOwner && participant?.isAdmin ? <button className='  rounded-full text-white font-bold hover:scale-105 duration-300 font-mono h-8 w-full bg-sky-500' onClick={() => handlParticipants('inAdmin')}>Dismiss as admin</button>
                                    : <button className='  rounded-full text-white font-bold hover:scale-105 duration-300 font-mono h-8 w-full  bg-sky-500' onClick={() => handlParticipants('admin')}>Make channel admin</button>}
                                <button className='  rounded-full text-white font-bold hover:scale-105 duration-300 font-mono h-8 w-full   bg-sky-500' onClick={() => setClick(4)}>Mute </button>
                                {participant?.isBanned ? <button className=' rounded-full text-white font-bold hover:scale-105 duration-300 font-mono h-8 w-full bg-sky-500' onClick={() => handlParticipants('no banned')}>Remove banned </button>
                                    : <button className=' rounded-full text-white font-bold hover:scale-105 duration-300 font-mono h-8 w-full bg-sky-500' onClick={() => handlParticipants('banned')}>banned</button>}
                            </div>
                        </div>
                    }
                    {
                        (click == 3) && <div className='h-auto bg-white p-2 -mt-[560px] lg:-mt-[655px]'>
                            <AddPeople participants={participants} setCancel={setClick} users={users} />
                        </div>
                    }
                    {
                        (click == 4) && <div className='w-full flex flex-col h-auto bg-white p-2 -mt-[160px] lg:-mt-[355px] rounded-xl'>
                            <div className='w-full flex bg-slfate-700'>
                                <div className="w-full flex justify-centefr gap-1 ">
                                    <img className='w-10 h-10 rounded-full' src={participant?.foto_user} />
                                    <h1 className='text-blue-800 font-mono text-xl flex items-center'>{participant?.username}</h1>
                                </div>
                                <div className="flex justify-end items-center w-full">
                                    <button className='-mt-2' onClick={() => setClick(2)} >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 20 20" fill="none">
                                            <path d="M13.71 10.71C13.801 10.6149 13.8724 10.5028 13.92 10.38C14.02 10.1365 14.02 9.86347 13.92 9.62C13.8724 9.49725 13.801 9.38511 13.71 9.29L10.71 6.29C10.5217 6.1017 10.2663 5.99591 10 5.99591C9.7337 5.99591 9.47831 6.1017 9.29 6.29C9.1017 6.47831 8.99591 6.7337 8.99591 7C8.99591 7.26631 9.1017 7.5217 9.29 7.71L10.59 9H7C6.73479 9 6.48043 9.10536 6.2929 9.2929C6.10536 9.48043 6 9.73479 6 10C6 10.2652 6.10536 10.5196 6.2929 10.7071C6.48043 10.8946 6.73479 11 7 11H10.59L9.29 12.29C9.19628 12.383 9.12188 12.4936 9.07111 12.6154C9.02034 12.7373 8.99421 12.868 8.99421 13C8.99421 13.132 9.02034 13.2627 9.07111 13.3846C9.12188 13.5064 9.19628 13.617 9.29 13.71C9.38297 13.8037 9.49357 13.8781 9.61543 13.9289C9.73729 13.9797 9.86799 14.0058 10 14.0058C10.132 14.0058 10.2627 13.9797 10.3846 13.9289C10.5064 13.8781 10.617 13.8037 10.71 13.71L13.71 10.71ZM20 10C20 8.02219 19.4135 6.08879 18.3147 4.4443C17.2159 2.79981 15.6541 1.51809 13.8268 0.761209C11.9996 0.00433284 9.98891 -0.193701 8.0491 0.192152C6.10929 0.578004 4.32746 1.53041 2.92894 2.92894C1.53041 4.32746 0.578004 6.10929 0.192152 8.0491C-0.193701 9.98891 0.00433284 11.9996 0.761209 13.8268C1.51809 15.6541 2.79981 17.2159 4.4443 18.3147C6.08879 19.4135 8.02219 20 10 20C12.6522 20 15.1957 18.9464 17.0711 17.0711C18.9464 15.1957 20 12.6522 20 10V10ZM2 10C2 8.41775 2.4692 6.87104 3.34825 5.55544C4.2273 4.23985 5.47673 3.21447 6.93854 2.60897C8.40035 2.00347 10.0089 1.84504 11.5607 2.15372C13.1126 2.4624 14.538 3.22433 15.6569 4.34315C16.7757 5.46197 17.5376 6.88743 17.8463 8.43928C18.155 9.99113 17.9965 11.5997 17.391 13.0615C16.7855 14.5233 15.7602 15.7727 14.4446 16.6518C13.129 17.5308 11.5823 18 10 18C7.87827 18 5.84344 17.1572 4.34315 15.6569C2.84286 14.1566 2 12.1217 2 10V10Z" fill="#3D64CA" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {!participant?.timeMute ? <div className="w-full flex  justify-center gap-6">
                                <select className='focus:outline-none font-semibold  bg-blue-300 p-2 mt-4' onChange={(e) => setDuration(e.target.value)}>
                                    <option value="1day">1day</option>
                                    <option value="1week">1week</option>
                                </select>
                                <button className='mt-3' onClick={() => { handlParticipants('mute') }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                        <path d="M10.1899 5.23019C10.7809 5.07621 11.3892 4.99891 11.9999 5.00019C13.8565 5.00019 15.6369 5.73768 16.9497 7.05044C18.2624 8.36319 18.9999 10.1437 18.9999 12.0002C19.0012 12.6109 18.9239 13.2192 18.7699 13.8102C18.735 13.9369 18.7255 14.0693 18.7418 14.1997C18.7581 14.3301 18.7999 14.4561 18.8649 14.5703C18.93 14.6845 19.0169 14.7848 19.1207 14.8655C19.2245 14.9461 19.3432 15.0055 19.4699 15.0402C19.5563 15.05 19.6436 15.05 19.7299 15.0402C19.9557 15.0479 20.1774 14.979 20.359 14.8446C20.5406 14.7102 20.6713 14.5183 20.7299 14.3002C20.9196 13.5485 21.0104 12.7753 20.9999 12.0002C20.9999 9.61324 20.0517 7.32405 18.3639 5.63622C16.6761 3.9484 14.3869 3.00019 11.9999 3.00019C11.2134 2.99691 10.43 3.09779 9.66994 3.30019C9.41944 3.37663 9.20892 3.54829 9.08363 3.77829C8.95835 4.00829 8.9283 4.27827 8.99994 4.53019C9.07029 4.77746 9.23316 4.98815 9.45476 5.1185C9.67635 5.24885 9.93963 5.28884 10.1899 5.23019ZM21.7099 20.2902L3.70994 2.29019C3.52164 2.10188 3.26624 1.99609 2.99994 1.99609C2.73364 1.99609 2.47824 2.10188 2.28994 2.29019C2.10164 2.47849 1.99585 2.73388 1.99585 3.00019C1.99585 3.26649 2.10164 3.52188 2.28994 3.71019L4.99994 6.38019C3.72442 7.97564 3.02956 9.95753 3.02956 12.0002C3.02956 14.0428 3.72442 16.0247 4.99994 17.6202L3.28994 19.2902C3.15118 19.4308 3.05719 19.6094 3.01981 19.8034C2.98244 19.9974 3.00336 20.1981 3.07994 20.3802C3.15496 20.5628 3.28236 20.7191 3.44608 20.8295C3.6098 20.9398 3.80252 20.9992 3.99994 21.0002H11.9999C14.0462 20.9918 16.0284 20.2863 17.6199 19.0002L20.2899 21.6802C20.3829 21.7739 20.4935 21.8483 20.6154 21.8991C20.7372 21.9498 20.8679 21.976 20.9999 21.976C21.132 21.976 21.2627 21.9498 21.3845 21.8991C21.5064 21.8483 21.617 21.7739 21.7099 21.6802C21.8902 21.4937 21.9909 21.2445 21.9909 20.9852C21.9909 20.7258 21.8902 20.4767 21.7099 20.2902V20.2902ZM11.9999 19.0002H6.40994L7.04994 18.3702C7.23619 18.1828 7.34073 17.9294 7.34073 17.6652C7.34073 17.401 7.23619 17.1475 7.04994 16.9602C5.85843 15.7687 5.13672 14.1873 5.01732 12.5065C4.89792 10.8257 5.38884 9.15818 6.39994 7.81019L16.1899 17.6002C14.981 18.5069 13.5111 18.998 11.9999 19.0002Z" fill="#0C15F2" />
                                    </svg>
                                </button>
                            </div> : <div className=''>{handlTime(participant.timeMute)}</div>}
                        </div>
                    }
                    {
                        (click == 5) && <div className='w-full flex flex-col h-14 p-2 -mt-[160px] lg:-mt-[355px]  '>
                            <div className=' bg-skhy-200 p-4 mt-j4 flex flex-row items-center justify-center'>
                                <button onClick={() => setClick(0)} className=' bg-white w-20 h-10 border  mr-4'>Cancel</button>
                                <button onClick={handlRemove} className=' bg-sky-400 w-52 h-10 border border-sky-200 text-white'>Remove</button>
                            </div>
                        </div>

                    }
                </div >

            }
        </>
    )
}
export default EditChannel