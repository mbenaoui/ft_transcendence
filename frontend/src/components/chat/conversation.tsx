import React, { useEffect, useState } from 'react'
import { userProps, messageProps, channelProps, participantsProps, userData, participantsData } from '@/interface/data'
import { Socket } from 'socket.io-client';
import { useRouter } from 'next/router';
import Edit from './direct/edit';
import EditChannel from './channels/editChannel';
import { Constant } from '@/constants/constant';
import { handelChallenge } from '../game/listOfFriends';
import Link from 'next/link';
interface LevelBarpros {
    value: string
}

const Conversation = ({ onlineUsersss, socket, myStatusInRoom, currentUser, setMsg2, users, amis, chatSocket, button, Room, setStatus_Tow_User, status_tow_user }: { amis: Array<userProps>, onlineUsersss: Array<number>, socket: Socket, myStatusInRoom: participantsProps, currentUser: userProps, setMsg2: (value: string) => void, users: userProps[], chatSocket: Socket, button: boolean, Room: channelProps, setStatus_Tow_User: (value: boolean) => void, status_tow_user: boolean }) => {
    const [messages, setMessages] = useState<messageProps[]>([]);
    const [content, setContent] = useState('');
    const [isend, setIsend] = useState(false);
    const [flag, setfalg] = useState(false);
    const [msg, setMsg] = useState('')
    const [receiver, setReceiver] = useState<userProps>(userData)
    const [myStatusInRoom1, setMyStatusInRoom1] = useState<participantsProps>(participantsData)
    const [selectUser, setselectUser] = useState<Number>(-1);
    const [click, setclick] = useState(true)
    let router = useRouter()
    useEffect(() => {
        let id = Number(router.query.user)
        users.map((item) => {
            if (id == item.id)
                  setReceiver(item)
            
        })
        setMessages([])
    }, [router])

    const [status, setstatus] = useState<any>('');
    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`${Constant.API_URL}/chat/statusChatTwoUser/${receiver.id}`, {
                        credentials: 'include',
                    });
                    const content = await response.json();
                    setstatus(content)
                } catch (error) {
                }
            }
        )();
        setContent('')
        setMsg2(msg);
    }, [receiver, isend, msg, status_tow_user]);


    useEffect(() => {
        const usrs = users.filter((user: userProps) => {
            user.flag = true
            amis.filter((usr: userProps) => {
                if (usr.id == user.id) {
                    user.flag = false
                }
            })
        }
        )
    }, [users])

    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`${Constant.API_URL}/friends/accepted-friends/${currentUser.id}`, {
                        credentials: 'include',
                    });
                    const content = await response.json();
                    if (response.ok) {
                        const usrs = users.filter((user: userProps) => {
                            user.flag = true
                            content.filter((usr: userProps) => {
                                if (usr.id == user.id) {
                                    user.flag = false
                                }
                            })
                        }
                        )
                    }
                } catch (error) {
                }
            }
        )();
    }, [users, currentUser, receiver]);

    if (!button) {
        useEffect(() => {
            if (receiver.id) {
                (
                    async () => {
                        try {
                            const response = await fetch(`${Constant.API_URL}/chat/getConversationDirect/${receiver.id}`, {
                                credentials: 'include',
                            });
                            const content = await response.json();
                            setMessages(Array.from(content))
                        } catch (error) {

                        }
                    }
                )();
            }
            setContent('')
        }, [receiver, isend, msg, button]);
    }
    else {
        useEffect(() => {
            if (Room.id) {
                (
                    async () => {
                        try {
                            const response = await fetch(`${Constant.API_URL}/chat/allMessagesChannel/${Room.id}`, {
                                credentials: 'include',
                            });
                            const content = await response.json();
                            setMessages(Array.from(content))
                        } catch (error) {
                        }
                    }
                )();
                setContent('')
                setReceiver(userData)
            }
        }, [Room, isend, msg]);
    }

    // useEffect(() => {
    //     if (button) {
    //         if (receiver.id) {
    //         (
    //             async () => {
    //                 try {
    //                     const response = await fetch(`${Constant.API_URL}/chat/getConversationDirect/${receiver.id}`, {
    //                         credentials: 'include',
    //                     });
    //                     const content = await response.json();
    //                     setMessages(Array.from(content))
    //                 } catch (error) {

    //                 }
    //             }
    //         )();
    //         }
    //         setContent('')
    //     }
    //     else 
    //     {
    //         if (Room.id) {
    //         (
    //             async () => {
    //                 try {
    //                     const response = await fetch(`${Constant.API_URL}/chat/allMessagesChannel/${Room.id}`, {
    //                         credentials: 'include',
    //                     });
    //                     // console.log("resp (allMessagesChannel) ==== ", response);
    //                     const content = await response.json();
    //                     // console.log("resp (CONTENT) ==== ", content);
    //                     setMessages(Array.from(content))
    //                     // ("content :", content)
    //                 } catch (error) {
    //                     console.log("error (allMessagesChannel) ", error);
    //                 }
    //             }
    //             )();
    //             setContent('')
    //             setReceiver(userData)
    //         }
    //     }
    // }, [receiver, isend, button,  /** */ Room, msg]);

    useEffect(() => {
        chatSocket?.on('updateConv', (message) => {
            ('hello word')
        })
        chatSocket?.on('message', (message) => {
            // ('message: ', message);
            setMsg(message);
        });
    }, [chatSocket, button])
    useEffect(() => {
        setReceiver(userData);

    }, [button])

    const handleClick = async () => {
        if (content) {
            if (!button) {
                await fetch(`${Constant.API_URL}/chat/directMessage/${receiver.id}`, {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "content": content,
                    }),
                    credentials: 'include',
                });
                chatSocket.emit('message', { senderId: currentUser.id, receiverId: receiver.id, content: content });
            }
            else {
                await fetch(`${Constant.API_URL}/chat/sendMessageToChannel/${Room.id}`, {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "content": content,
                    }),
                    credentials: 'include',
                });
                chatSocket.emit('room', { senderId: currentUser.id, roomId: Room.id, content: content });
            }
        }
        if (isend == false)
            setIsend(true)
        else if (isend == true)
            setIsend(false)
        setContent('')

    };
    const handleClick1 = async (e: any) => {
        if (e.key == 'Enter') {
            if (content) {
                if (!button) {

                    await fetch(`${Constant.API_URL}/chat/directMessage/${receiver.id}`, {
                        method: 'POST',

                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "content": content,
                        }),
                        credentials: 'include',
                    });
                    chatSocket.emit('message', { senderId: currentUser.id, receiverId: receiver.id, content: content });
                }
                else {

                    await fetch(`${Constant.API_URL}/chat/sendMessageToChannel/${Room.id}`, {
                        method: 'POST',

                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            "content": content,
                        }),
                        credentials: 'include',
                    });
                    chatSocket.emit('room', { senderId: currentUser.id, roomId: Room.id, content: content });

                }
            }
            if (isend == false)
                setIsend(true)
            else if (isend == true)
                setIsend(false)
            setContent('')
        }


    };
    const handltime = (time: string) => {
        const dateObject = new Date(time);
        const formattedTime = dateObject.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return <div className="text-right text-gray-500 text-xs font-medium font-['Satoshi'] mt-2 ">{formattedTime}</div>
    }

    const unblockChatTwoUser = async () => {

        const response = await fetch(`${Constant.API_URL}/chat/unblockChatTwoUser/${receiver.id}`, {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });
        if (response.ok)
            setStatus_Tow_User(false)
    }

    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`${Constant.API_URL}/chat/myStatusInRoom/${Room.id}`, {
                        credentials: 'include',
                    });
                    const content = await response.json();
                    setMyStatusInRoom1(content)
                } catch (error) {

                }
            }
        )();
    }, [Room]);
    useEffect(() => {
        chatSocket?.on('updateConv', async () => {

            try {
                const response = await fetch(`${Constant.API_URL}/chat/myStatusInRoom/${Room?.id}`, {
                    credentials: 'include',
                });
                const content = await response.json();
                setMyStatusInRoom1(content)
            } catch (error) {

            }
        })
    }, [chatSocket, Room]);


    return (
        <div className="w-[45%] flex-auto fledx h-[820px] mt-12 relative bg-whilte  border-2  border-sky-400 rounded-xl ">
            {
                ((receiver.id != 0 || Room.id != 0)) ? (
                    <>
                        <div className=' w-full flex justify-center items-center '>

                            <div className=' flex w-[97%] bg-white relative h-16 rounded-xl border-2 justify-start items-center  border-sky-400 wml-3 mt-2 '>
                                {button == false && <div className=" bg-sflate-400  sm:ml-4 w-auto flex" >
                                    <img className="w-14 h-14 rounded-full border-2 border-sky-400" src={receiver?.foto_user} />
                                    <div className="flex-col w-full bg-fslate-500 space-x-2 px-2 ml-2 ">
                                        <h1 className="text-xl font-semibold mt-1">{receiver?.username}</h1>
                                        <div className={` text-sm  flex justify-center items-center space-x-2 ${(!receiver.flag) ? ' ' : ' hidden '}`}>
                                            <div className="">{onlineUsersss.includes(receiver.id) ? 'online' : 'offline'}</div>
                                            <div className={` w-[8px] h-[8px]  rounded-full ${onlineUsersss.includes(receiver.id) ? 'bg-green-500' : 'bg-red-500'}`} />
                                        </div>
                                    </div>
                                </div>}
                                {button == true && <div className="ml-4 flex   p-1 space-x-2  justify-center items-center" >
                                    {Room.id && <div className={`flex justify-center items-center w-14 h-14 rounded-full border-2 border-sky-400  ${Room.type == 'public' && ' bg-green-300'}  ${Room.type == 'private' && ' bg-red-400'}  ${Room.type == 'protected' && ' bg-yellow-400'}`} >
                                        <h1 className='flex items-center justify-center text-[40px] font-bold text-white'>{Room?.name[0].toUpperCase()}</h1>
                                    </div>}
                                    <div className="">
                                        <p className="text-xl font-semibold">{Room?.name}</p>
                                    </div>
                                </div>}
                                {!button && (status.status == "accepted" || !status) && <div className='absolute   flex items-center right-10 md:right-10  h-full'>
                                    <button onClick={() => {
                                        onlineUsersss.includes(receiver?.id) ? handelChallenge({ oppId: receiver.id, socket: socket, currentUser: currentUser, selectUser: selectUser, setselectUser: setselectUser, router: router, setclick: setclick }) : undefined
                                    }} className=' flex justify-center items-center hover:scale-110 duration-300'><svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" viewBox="0 0 24 24" fill="none">
                                            <path d="M20.7099 16.0997L19.0699 14.4597C18.9264 14.3265 18.828 14.1517 18.7886 13.9599C18.7491 13.7681 18.7706 13.5687 18.8499 13.3897C19.1987 12.6408 19.3828 11.8258 19.3899 10.9997C19.3946 10.9665 19.3946 10.9328 19.3899 10.8997C19.3934 9.70307 19.0228 8.5353 18.3299 7.55968C16.991 5.68844 15.2166 4.17141 13.1599 3.13968C11.8554 2.50104 10.3844 2.28405 8.95101 2.51877C7.51759 2.75349 6.19269 3.4283 5.15994 4.44968L4.48994 5.11968C3.45782 6.15634 2.77642 7.49032 2.54145 8.93418C2.30649 10.378 2.52977 11.8592 3.17994 13.1697L3.27994 13.3397C2.74628 13.8933 2.44558 14.6307 2.43994 15.3997C2.44391 15.9303 2.58855 16.4504 2.8591 16.9068C3.12965 17.3633 3.51644 17.7399 3.98 17.9981C4.44357 18.2563 4.96733 18.3869 5.49786 18.3767C6.02839 18.3664 6.5467 18.2156 6.99994 17.9397C7.17994 18.0797 7.33994 18.2297 7.51994 18.3597C7.89845 18.6229 8.30827 18.8378 8.73994 18.9997H8.82994C9.00994 19.0697 9.19994 19.1297 9.39994 19.1897H9.54994C9.86115 19.2696 10.1792 19.3198 10.4999 19.3397H10.7799H10.8999H11.1199C11.3299 19.3397 11.5299 19.3397 11.7399 19.2797H11.9099C12.4016 19.1953 12.8794 19.0438 13.3299 18.8297C13.5095 18.7574 13.7062 18.7387 13.8961 18.776C14.086 18.8133 14.261 18.9049 14.3999 19.0397L15.8599 20.4997C16.4934 21.1354 17.3525 21.4948 18.2499 21.4997C19.0027 21.4916 19.7217 21.186 20.2499 20.6497L20.6299 20.2697C21.1815 19.7207 21.4982 18.9789 21.5131 18.2009C21.5281 17.4228 21.2401 16.6694 20.7099 16.0997ZM5.40994 16.4197C5.21216 16.4197 5.01882 16.361 4.85437 16.2511C4.68992 16.1413 4.56175 15.9851 4.48606 15.8024C4.41037 15.6196 4.39057 15.4186 4.42916 15.2246C4.46774 15.0306 4.56298 14.8524 4.70283 14.7126C4.84269 14.5727 5.02087 14.4775 5.21485 14.4389C5.40883 14.4003 5.6099 14.4201 5.79262 14.4958C5.97535 14.5715 6.13153 14.6997 6.24141 14.8641C6.35129 15.0286 6.40994 15.2219 6.40994 15.4197C6.40994 15.6849 6.30458 15.9392 6.11705 16.1268C5.92951 16.3143 5.67516 16.4197 5.40994 16.4197ZM8.50994 16.5597L8.24994 16.3597C8.35407 16.0571 8.40811 15.7396 8.40994 15.4197C8.40994 14.624 8.09387 13.861 7.53126 13.2984C6.96865 12.7357 6.20559 12.4197 5.40994 12.4197C5.27994 12.4197 5.15994 12.4197 5.02994 12.4197L4.93994 12.2597C4.47482 11.3242 4.3144 10.2666 4.4812 9.23527C4.648 8.20397 5.13365 7.25081 5.86994 6.50968L6.53994 5.83968C7.2906 5.12022 8.24687 4.65268 9.27567 4.50213C10.3045 4.35157 11.3546 4.52549 12.2799 4.99968C13.9598 5.83989 15.4189 7.06269 16.5399 8.56968L8.50994 16.5597ZM19.2899 18.9297L18.9199 19.3097C18.4999 19.7297 17.8499 19.6497 17.3099 19.1097L15.8499 17.6597C15.42 17.2325 14.8707 16.9456 14.2745 16.8367C13.6783 16.7278 13.0631 16.8021 12.5099 17.0497C12.1947 17.2042 11.8573 17.3087 11.5099 17.3597C11.3188 17.3962 11.1245 17.4129 10.9299 17.4097H10.5899H10.4899L17.3599 10.5397C17.4299 11.2248 17.3124 11.9161 17.0199 12.5397C16.7723 13.0929 16.6981 13.7081 16.807 14.3043C16.9159 14.9005 17.2028 15.4497 17.6299 15.8797L19.2699 17.5297C19.4559 17.714 19.5621 17.9638 19.5658 18.2256C19.5696 18.4874 19.4705 18.7401 19.2899 18.9297Z" fill="#2D8EE8" />
                                        </svg>
                                    </button>
                                </div>}
                                <div className=' w-full h-auto flex lg:hidden justify-end items-center  mr-2'>
                                    {
                                        flag &&
                                        <div className='  flex absolute z-30 justify-center items-center bgf-slate-600'>
                                            <button onClick={() => setfalg(false)} className=' hover:scale-125 duration-300'><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none">
                                                <path d="M16.9999 13.4098L12.7099 9.16982C12.617 9.07609 12.5064 9.0017 12.3845 8.95093C12.2627 8.90016 12.132 8.87402 11.9999 8.87402C11.8679 8.87402 11.7372 8.90016 11.6154 8.95093C11.4935 9.0017 11.3829 9.07609 11.2899 9.16982L7.04995 13.4098C6.95622 13.5028 6.88183 13.6134 6.83106 13.7352C6.78029 13.8571 6.75415 13.9878 6.75415 14.1198C6.75415 14.2518 6.78029 14.3825 6.83106 14.5044C6.88183 14.6263 6.95622 14.7369 7.04995 14.8298C7.23731 15.0161 7.49076 15.1206 7.75495 15.1206C8.01913 15.1206 8.27259 15.0161 8.45995 14.8298L11.9999 11.2898L15.5399 14.8298C15.7262 15.0146 15.9776 15.1187 16.2399 15.1198C16.3716 15.1206 16.502 15.0954 16.6239 15.0456C16.7457 14.9958 16.8565 14.9225 16.9499 14.8298C17.047 14.7402 17.1254 14.6322 17.1805 14.5122C17.2356 14.3921 17.2664 14.2623 17.271 14.1302C17.2757 13.9982 17.2541 13.8666 17.2076 13.7429C17.161 13.6193 17.0905 13.506 16.9999 13.4098Z" fill="#2D8EE8" />
                                            </svg></button>
                                            <div className=" bg-blfack w-72  absolute z-20 h-[650px]  mr-[233px] mt-[720px] bg-white border-2 border-sky-400 rounded-xl p-4">

                                                {button == false &&
                                                    <div className=" bg-white w-full h-full flex-col justify-start items-center  bg-blwack  gasp-[26px] flex">
                                                        <Edit users={users} currentUser={currentUser} setStatus_Tow_User={setStatus_Tow_User} status_tow_user={status_tow_user} />
                                                    </div>
                                                }
                                                {button == true &&
                                                    <div className=" bg-white w-full h-full flex-col justify-start items-center   gasp-[26px]f flex">
                                                        <EditChannel chatSocket={chatSocket} users={users} currentUser={currentUser} Room={Room} />
                                                    </div>
                                                }
                                            </div>

                                        </div>
                                    }
                                    {
                                        !flag && <button onClick={() => setfalg(true)} className=' hover:scale-125 duration-300'>

                                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none">
                                                <path d="M16.9999 9.17019C16.8126 8.98394 16.5591 8.87939 16.2949 8.87939C16.0308 8.87939 15.7773 8.98394 15.5899 9.17019L11.9999 12.7102L8.45995 9.17019C8.27259 8.98394 8.01913 8.87939 7.75495 8.87939C7.49076 8.87939 7.23731 8.98394 7.04995 9.17019C6.95622 9.26315 6.88183 9.37375 6.83106 9.49561C6.78029 9.61747 6.75415 9.74818 6.75415 9.88019C6.75415 10.0122 6.78029 10.1429 6.83106 10.2648C6.88183 10.3866 6.95622 10.4972 7.04995 10.5902L11.2899 14.8302C11.3829 14.9239 11.4935 14.9983 11.6154 15.0491C11.7372 15.0998 11.8679 15.126 11.9999 15.126C12.132 15.126 12.2627 15.0998 12.3845 15.0491C12.5064 14.9983 12.617 14.9239 12.7099 14.8302L16.9999 10.5902C17.0937 10.4972 17.1681 10.3866 17.2188 10.2648C17.2696 10.1429 17.2957 10.0122 17.2957 9.88019C17.2957 9.74818 17.2696 9.61747 17.2188 9.49561C17.1681 9.37375 17.0937 9.26315 16.9999 9.17019Z" fill="#2D8EE8" />
                                            </svg>
                                        </button>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className={` overflow-y-scroll scrollbar-hide ${flag == true ? 'blur-sm lg:blur-0' : null}  bg-fblue-100 flex  flex-col-reverse mt-1  p-4 w-full  min-h-80 h-[83%] bg-bdlack `}>

                            {messages.map((item, index) => (
                                <div key={index}>
                                    {
                                        (currentUser.id == item.senderId) ? (<div className='flex-col'>
                                            <div className="w-full h-auto flex flex-col space-x-4 items-end ">
                                                <div className=" mr-16 max-w-[440px] overflow-x-aucto whitesdpace-pre-wrap    break-all w-auto h-auto  bg-blue-400 rounded-tl-[20px] rounded-tr-[20px] rounded-bl-[20px]  justify-center  p-3 items-center  text-xl  text-white">
                                                    <p className="whitespace-normal"> {item.content}</p>

                                                </div>
                                                <img className="w-12 h-12 -mt-10 rounded-full" src={currentUser.foto_user} />
                                            </div>
                                            <div className="w-full flex justify-end  text-wrap items-end">
                                                {handltime(item.createdAt)}
                                            </div>
                                        </div>) :
                                            (
                                                <div className='flex-col'>
                                                    <div className="w-full h-auto flex flex-col items-start">
                                                        <div className=" max-w-[440px] w-auto h-auto p-3 ml-16  break-all   bg-white rounded-tl-[20px] rounded-tr-[20px] rounded-br-[20px] justify-center   items-center  text-xl ">
                                                            <p className="whitespace-normal text-gray-600"> {item.content}</p>
                                                        </div>
                                                        {button == false && <img className="w-12 h-12  -mt-10  rounded-full" src={receiver.foto_user} />}
                                                        {button == true && <img className="w-12 h-12  -mt-10  rounded-full" src={item.foto_user} />}
                                                    </div>
                                                    <div className="w-full flex">
                                                        {handltime(item.createdAt)}
                                                    </div>
                                                </div>
                                            )
                                    }
                                </div>
                            ))}
                        </div>
                        <div className={` w-full  break-all   h-12 z-h10 mt-2  ${flag == true ? 'blur-sm  lg:blur-0' : null} lg:${flag == true ? null : null} flex flex-row px-3`}>
                            {
                                (button && !myStatusInRoom1.timeMute && !myStatusInRoom1.isBanned && Room.id) &&
                                <>
                                    <input
                                        className=" bg-white rounded-[30px]  text-wrap w-full  items-center  justify-center placeholder:italic bloc  border-2 border-sky-400 px-4 shadow-sm focus:outline-none    sm:text-sm"
                                        onChange={(e) => setContent(e.target.value)}
                                        type="text"
                                        name='Type here'
                                        value={content}
                                        placeholder="Type here........"
                                        autoComplete='off' onKeyDown={handleClick1}
                                    />
                                    <button
                                        className='hover:scale-110 duration-300'
                                        onClick={() => handleClick()}
                                    ><svg xmlns="http://www.w3.org/2000/svg" width="46" height="30" viewBox="0 0 21 18" fill="none">
                                            <path d="M18.1934 6.00798L4.19345 0.227983C3.66372 0.00876957 3.08228 -0.0540727 2.51795 0.0468957C1.95362 0.147864 1.43004 0.408415 1.00919 0.797703C0.588336 1.18699 0.287838 1.68871 0.143269 2.24348C-0.00130066 2.79824 0.0161127 3.38281 0.193447 3.92798L1.73345 8.77798L0.153447 13.628C-0.0286814 14.1753 -0.0491403 14.7636 0.0945214 15.3223C0.238183 15.881 0.539873 16.3864 0.963447 16.778C1.50809 17.283 2.22073 17.5681 2.96345 17.578C3.35818 17.5777 3.74898 17.4996 4.11345 17.348L18.1634 11.568C18.7106 11.3404 19.1782 10.9559 19.507 10.4629C19.8359 9.96994 20.0114 9.3906 20.0114 8.79798C20.0114 8.20537 19.8359 7.62603 19.507 7.13305C19.1782 6.64007 18.7106 6.25555 18.1634 6.02798L18.1934 6.00798ZM3.38345 15.478C3.20705 15.5507 3.01351 15.5715 2.82569 15.5379C2.63786 15.5042 2.46359 15.4175 2.32345 15.288C2.19143 15.1618 2.09648 15.0019 2.04888 14.8257C2.00129 14.6494 2.00287 14.4634 2.05345 14.288L3.51345 9.77798H17.2434L3.38345 15.478ZM3.51345 7.77798L2.02345 3.30798C1.97286 3.13253 1.97129 2.94658 2.01888 2.7703C2.06648 2.59402 2.16143 2.43413 2.29345 2.30798C2.38755 2.20926 2.50086 2.13083 2.6264 2.07752C2.75194 2.02421 2.88706 1.99714 3.02345 1.99798C3.15749 1.99824 3.29012 2.02545 3.41345 2.07798L17.2434 7.77798H3.51345Z" fill="#3AB8FF" />
                                        </svg></button>
                                </>
                            }
                            {

                                (status.status == "accepted" || !status) && !button &&
                                <>
                                    <input
                                        className=" bg-white rounded-[30px]  text-wrap w-full  items-center  justify-center placeholder:italic bloc  border-2 border-sky-400 px-4 shadow-sm focus:outline-none    sm:text-sm"
                                        onChange={(e) => setContent(e.target.value)}
                                        type="text"
                                        name='Type here'
                                        value={content}
                                        placeholder="Type here........"
                                        autoComplete='off' onKeyDown={handleClick1}
                                    />
                                    <button
                                        className='hover:scale-110 duration-300'
                                        onClick={() => handleClick()}
                                    ><svg xmlns="http://www.w3.org/2000/svg" width="46" height="30" viewBox="0 0 21 18" fill="none">
                                            <path d="M18.1934 6.00798L4.19345 0.227983C3.66372 0.00876957 3.08228 -0.0540727 2.51795 0.0468957C1.95362 0.147864 1.43004 0.408415 1.00919 0.797703C0.588336 1.18699 0.287838 1.68871 0.143269 2.24348C-0.00130066 2.79824 0.0161127 3.38281 0.193447 3.92798L1.73345 8.77798L0.153447 13.628C-0.0286814 14.1753 -0.0491403 14.7636 0.0945214 15.3223C0.238183 15.881 0.539873 16.3864 0.963447 16.778C1.50809 17.283 2.22073 17.5681 2.96345 17.578C3.35818 17.5777 3.74898 17.4996 4.11345 17.348L18.1634 11.568C18.7106 11.3404 19.1782 10.9559 19.507 10.4629C19.8359 9.96994 20.0114 9.3906 20.0114 8.79798C20.0114 8.20537 19.8359 7.62603 19.507 7.13305C19.1782 6.64007 18.7106 6.25555 18.1634 6.02798L18.1934 6.00798ZM3.38345 15.478C3.20705 15.5507 3.01351 15.5715 2.82569 15.5379C2.63786 15.5042 2.46359 15.4175 2.32345 15.288C2.19143 15.1618 2.09648 15.0019 2.04888 14.8257C2.00129 14.6494 2.00287 14.4634 2.05345 14.288L3.51345 9.77798H17.2434L3.38345 15.478ZM3.51345 7.77798L2.02345 3.30798C1.97286 3.13253 1.97129 2.94658 2.01888 2.7703C2.06648 2.59402 2.16143 2.43413 2.29345 2.30798C2.38755 2.20926 2.50086 2.13083 2.6264 2.07752C2.75194 2.02421 2.88706 1.99714 3.02345 1.99798C3.15749 1.99824 3.29012 2.02545 3.41345 2.07798L17.2434 7.77798H3.51345Z" fill="#3AB8FF" />
                                        </svg></button>
                                </>
                            }
                            <>
                                {
                                    status.status != "accepted" && <>
                                        {
                                            status.userAId == currentUser.id &&
                                            <div className=' w-full h-full  flex justify-center items-center'>
                                                <Link href={'/listblocked'} className='w-[80%] h-full rounded-full flex hover:scale-105 duration-300  items-center  justify-center   text-md  bg-blue-400 shadow-md text-white border-2 mdl-20 border-white'>Unblocked {receiver.username} </Link>
                                            </div>
                                        }
                                        {
                                            status.userBId == currentUser.id &&
                                            <div className=' w-full h-full  flex justify-center items-center'>
                                                <div className='w-[80] h-full  bg-red-500 rounded-full  flex justify-center items-center p-3 text-white '>I'm sorry you cannot provide a message for this user </div>
                                            </div>

                                        }
                                    </>
                                }
                            </>

                        </div>


                    </>) : (
                    <div className=' w-full h-full flex justify-center items-center text-xl'>No conversation select</div>
                )


            }
        </div>
    )
}
export default Conversation