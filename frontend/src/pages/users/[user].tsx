import { AppProps, userData, userProps } from '@/interface/data';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import path from 'path';
import { send } from 'process';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Constant } from '@/constants/constant';
import { getTheGrad, handelChallenge } from '@/components/game/listOfFriends';

import Friends from '@/components/user/friend';
import Rank from '@/components/user/rank';


interface LevelBarpros {
    value: string
}
function LevelBar({ value }: LevelBarpros) {

    let progressWidth;
    if (value.length > 1)
        progressWidth = `${value}%`;
    else
        progressWidth = `${value}0%`;

    return (
        <div className="bg-white h-5  drop-shadow shadow-md shadow-black    w-80  rounded-lg" >
            <div className="bg-[#0ea5e9] h-5 rounded-lg " style={{ width: progressWidth }}>
                {/* <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
              {`${value}%`} */}
                {/* </span> */}
            </div>
        </div >
    );
}

const YourComponent = ({ onlineUsersss, socket, currentFileName }: { onlineUsersss: Array<Number>, socket: any, currentFileName: any }) => {
    const [flag, setFlag] = useState(true)
    const [flag1, setFlag1] = useState(true)
    const [flag2, setFlag2] = useState(true)
    const [ref, setref] = useState(true)
    const [check_user, setCheck_user] = useState(true)
    const [username, setUsername] = useState("");
    const [level, setlevel] = useState();
    const [level1, setlevel1] = useState("");
    const [level2, setlevel2] = useState("");
    const [Email, setEmail] = useState("");
    const [foto_user, setFoto_user] = useState("");
    const [check, setCheck] = useState(2);
    const [check_blocked1, setCheck_bloked1] = useState(true);
    const [check_blocked2, setCheck_bloked2] = useState(true);
    const [check1, setCheck1] = useState(0);
    const [check2, setCheck2] = useState(0);
    const [blocked, setblocked] = useState(0);
    const [isOpen, setIsOpen] = useState(false)
    const [isOpen1, setIsOpen1] = useState(false)
    const [isfriend, setisfriend] = useState(false)
    // const [id, setid] = useState(0)
    const [query, setQuery] = useState('')
    const [amis, setAmis] = useState<Array<userProps>>([])
    const [amis_id, setAmisid] = useState<Array<userProps>>([])
    const [delete_request, setdelete_request] = useState<any>([])
    const [selectUser, setselectUser] = useState<Number>(-1);

    const [received, setreceived] = useState<Array<any>>([]);
    const [sendr, setsendr] = useState<Array<any>>([]);
    const [received_blocked, setreceived_blocked] = useState<Array<any>>([]);
    const [sendr_blocked, setsendr_blocked] = useState<Array<any>>([]);

    const router = useRouter()
    const parts = currentFileName.split('.');
    const numberPart: number = Number(parts[1]);
    const usernamePart: string = parts[0];
    const [id, setid] = useState(0);
    const [currentUser, setCurrentUser] = useState<userProps>(userData);
    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`${Constant.API_URL}/auth/user`, {
                        credentials: 'include',
                    });
                    if (response.ok) {

                        const content = await response.json();
                        setCurrentUser(content)
                        setid(content.id);
                    }
                } catch (error) {
                }
            }
        )();
    }, []);

    useEffect(() => {
        if (numberPart === id) {
            router.push("/profile")
        }
        setCheck(2)
    }, [id, numberPart]);

    useEffect(() => {
        (
            async () => {
                try {

                    const response = await fetch(`${Constant.API_URL}/friends/accepted-friends/${numberPart}`, {
                        credentials: 'include',
                    });
                    const content = await response.json();

                    setAmisid(Array.from(content));
                } catch (error) {

                }


            }
        )();
    }, [query, numberPart, isfriend, check, check1, check2]);
    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`${Constant.API_URL}/friends/accepted-friends/${id}`, {
                        credentials: 'include',
                    });
                    if (response.ok) {
                        const content = await response.json();
                        setAmis(Array.from(content));
                    }
                } catch (error) {

                }

            }
        )();
    }, [query, numberPart, isfriend, check, check_blocked1, check_blocked2, check1, check2]);



    useEffect(() => {
        (
            async () => {
                setCheck1(0);
                setCheck2(0);
                setIsOpen(false)
            }
        )();
    }, [query, numberPart, send, received]);



    const freind_ranck = async (fd: number) => {
        setCheck(fd)
        if (check1 == 0) {
            setCheck1(1);
            setCheck2(0);

        }
        else if (check1 == 1) {

            setCheck2(0);
            setCheck1(0);
        }

    }
    const freind_ranck1 = async (fd: number) => {
        setCheck(fd)
        if (check2 == 0) {
            setCheck2(1);
            setCheck1(0);
        }
        else if (check2 == 1) {
            setCheck2(0);
            setCheck1(0);
        }

    };


    useEffect(() => {
        (
            async () => {
                try {

                    const response = await fetch(`${Constant.API_URL}/users/one/${usernamePart}/${numberPart}`, {
                        credentials: 'include',
                    });
                    const content = await response.json();
                    if (response.status == 200) {

                        setUsername(content.username)
                        setEmail(content.email)
                        setFoto_user(content.foto_user)
                        setlevel(content.level)
                        const stringValue2: string = String(level);
                        const level3 = stringValue2.split('.');
                        if (level3[1])
                            setlevel1(level3[1]);
                        else
                            setlevel1("0");
                        setlevel2(level3[0]);


                        return;
                    }
                    else
                        setCheck_user(false);
                } catch (error) {

                }
            }

        )();
    });

    useEffect(() => {
        (
            async () => {
                try {

                    const response = await fetch(`${Constant.API_URL}/friends/received-blocked`, {
                        credentials: 'include',
                    });
                    const counte = await response.json();
                    if (response.status == 200) {
                        setreceived_blocked(counte)
                        return;
                    }
                } catch (error) {
                }
            }
        )();
    }, [id, numberPart, isOpen, isOpen1, currentFileName]);

    useEffect(() => {
        (
            async () => {
                try {

                    const response = await fetch(`${Constant.API_URL}/friends/received-requests`, {
                        credentials: 'include',
                    });
                    const counte = await response.json();
                    if (response.status == 200) {
                        setreceived(counte)
                        return;
                    }
                } catch (error) {
                }
            }
        )();
    }, [id, numberPart, isOpen, check_blocked1, flag1, check_blocked2, currentFileName]);
    // useEffect(() => {
    //     (
    //         async () => {
    //             try {

    //                 const response = await fetch(`${Constant.API_URL}/friends/send-request/${numberPart}`, {
    //                     credentials: 'include',
    //                 });
    //                 const content = await response.json();
    //                 if (response.status == 200) {
    //                     setFlag2(content);
    //                     // setrequestt(cont)
    //                     return;
    //                 }
    //             } catch (error) {

    //             }
    //         }
    //     )();
    // }, [sendr, received, numberPart, isOpen]);
    // useEffect(() => {
    //     (
    //         async () => {
    //             try {

    //                 const response = await fetch(`${Constant.API_URL}/friends/send-request/${numberPart}`, {
    //                     credentials: 'include',
    //                 });
    //                 const counte = await response.json();
    //                 if (response.status == 200) {
    //                     setFlag2(counte);
    //                     // setrequestt(cont)
    //                     return;
    //                 }
    //             } catch (error) {
    //             }
    //         }
    //     )();
    // }, [sendr, received, numberPart, ref, check_blocked1, check_blocked2, isOpen]);
    useEffect(() => {
        (
            async () => {
                try {

                    const response = await fetch(`${Constant.API_URL}/friends/send-blocked`, {
                        credentials: 'include',
                    });
                    const counte = await response.json();
                    if (response.status == 200) {
                        setsendr_blocked(counte)
                        return;
                    }
                } catch (error) {
                }
            }
        )();
    }, [id, numberPart, received, check, check1, isOpen, isOpen1, check2, currentFileName]);
    useEffect(() => {
        (
            async () => {
                try {

                    const response = await fetch(`${Constant.API_URL}/friends/send-requests`, {
                        credentials: 'include',
                    });
                    const counte = await response.json();
                    if (response.status == 200) {
                        setsendr(counte)
                        return;
                    }
                } catch (error) {
                }
            }
        )();
    }, [id, numberPart, received, check, check1, ref, isOpen, check2, currentFileName]);
    const sendRequestForaccpet = async () => {
        try {

            const response = await fetch(`${Constant.API_URL}/friends/accept-friend-request/${numberPart}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setisfriend(!isfriend);
            } else {
                setIsOpen(false);
                console.error('Failed to send friend request.');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };
    const blockedfriend = async () => {
        try {

            const response = await fetch(`${Constant.API_URL}/friends/blocked-friend-request/${numberPart}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                router.push("/")
            } else {
                console.error('Failed to send friend request.');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    }
    const sendRequest = async () => {
        try {
            const response = await fetch(`${Constant.API_URL}/friends/send-request/${numberPart}`, {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                setIsOpen(true);
                setFlag1(true);
            } else {
                console.error('Failed to send friend request.');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };
    const cancelRequest = async () => {
        try {
            const response = await fetch(`${Constant.API_URL}/friends/delete-friend-request/${numberPart}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                setIsOpen(false);
            } else {
                setIsOpen(false);
                console.error('Failed to delete-friend-request.');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };
    const received_request = async () => {
        try {
            const response = await fetch(`${Constant.API_URL}/friends/delete-friend-request/${numberPart}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                setFlag1(true)
            } else {
                console.error('Failed to delete-friend-request.');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${Constant.API_URL}/friends/accepted-friends/${id}`, {
                    credentials: 'include',
                });
                const content = await response.json();
                setAmis(content);
            }
        )();
    }, [query, id, check, check1, check2, numberPart, currentFileName]);

    useEffect(() => {
        setFlag(true)
        setFlag1(true)

    }, [numberPart, currentFileName])

    useEffect(() => {
        if (Array.isArray(amis)) {
            amis.filter((usr: any) => {
                if (usr.id == numberPart)
                    setFlag(false)
            })
        } else { }

        // useEffect(() => {
        if (Array.isArray(received_blocked)) {
            received_blocked.map((user: any) => {
                // Your mapping logic here
                if (user.sender.id == numberPart) {

                    setCheck_bloked1(false)
                }
            });
        } else { }
        if (Array.isArray(sendr_blocked)) {
            sendr_blocked.map((user: any) => {

                // Your mapping logic here
                if (user.receiver.id == numberPart) {
                    setCheck_bloked2(false)
                }
            });
        } else {
            // Handle the case when 'received' is not an array (e.g., show an error message)
        }
        if (Array.isArray(received)) {
            received.map((user: any) => {
                // Your mapping logic here
                if (user.sender.id == numberPart) {

                    setFlag1(false)
                }
            });
        } else { }
        if (Array.isArray(sendr)) {
            sendr.map((user: any) => {
                // Your mapping logic here
                if (user.receiver.id == numberPart) {


                    setIsOpen(true)
                }
            });
        } else {
            // Handle the case when 'received' is not an array (e.g., show an error message)
        }
        // setFlag2(true)
    }, [sendr, numberPart, isfriend, received, currentFileName, sendr_blocked, received_blocked, amis, amis_id, flag2, delete_request])
    const getLevel = (level: number | any): string => {
        if (!level)
            return '0'
        return level.toString().slice(0, level.toString().indexOf('.') + 3)
    }
    const extractdecimalNumberFromLevel = (_level: number) => {
        var level: string = _level.toString() + '0'
        const ret = level.toString().indexOf('.') == -1 ? 0 : level.toString().slice(level.toString().indexOf('.') + 1, level.toString().indexOf('.') + 3)
        return Number(ret) > 2 ? ret : 0
    }
    return (
        <div className='flex  flex-col'>
            <div className=' '>

                {
                    (!check_blocked1 || !check_blocked2) ?
                        (
                            (
                                (!check_blocked1) ?
                                    (
                                        <div className=' flex z-10  h-screen w-screen  justify-center items-center '>

                                            <div className='flex  justify-center flex-col  h-80  w-[500px]  ml-12 z-20  drop-shadow-2xl  border-2 border-blue-500 rounded-2xl  items-center text-black bg-white '>
                                                <p className=' text-xl  '> @{username} ?</p>
                                                <span className=' text-sm mt-4'> You  cannot reach this user </span>
                                                <Link className=' flex justify-center items-center text-black mt-8 w-56 h-10 rounded-2xl  border-2 bg-white  shadow-md  border-blue-500 hover:scale-110 duration-300' href={'/'}>Canecel</Link>

                                            </div>
                                        </div>
                                    ) :

                                    <div className=' flex z-10  h-screen w-screen  justify-center items-center '>

                                        <div className='flex  justify-center flex-col  h-80  w-[500px]  ml-12 z-20  drop-shadow-2xl  border-2 border-blue-500 rounded-2xl  items-center text-black bg-white '>
                                            <p className=' text-xl  -mt-10'> Unblock @{username} ?</p>
                                            <span className=' text-sm mt-6'> They will  be able to follow you and view your Tweets </span>

                                            <Link className=' flex justify-center items-center text-black  bg-white  w-56  rounded-2xl h-10 mt-8 border-2  border-blue-500 shadow-md hover:scale-110 duration-300' href={'/listblocked'}>Unblock</Link>

                                            <Link className=' flex justify-center items-center text-black mt-6 w-56 h-10 rounded-2xl  border-2  border-blue-500 shadow-md hover:scale-110 duration-300' href={'/'}>Canecel</Link>

                                        </div >
                                    </div >

                            )
                        ) :
                        (check_user) ?
                            (<div className={`flex    ${blocked == 1 ? 'blur-sm' : null}  flex-wrap  justify-center min-h-screen   bg-dblack items-cdenter  min-w-screen    items-center   `}>
                                <div className='  flex-none   z-20 w-auto  sm:w-[408px] mt-[120px] mb-10  h-[100%]  shadow-xl  shadow-[#728edb] justify-center bg-gradient-to-r from-cyan-500 to-blue-500 rounded-[40px] p-4 sm:p-6  text-white'>
                                    <div className="text-center w-full flex justify-center items-center flex-col ">
                                        <span>Profile {username}</span>
                                        <div className="mt-6">
                                            <img
                                                src={foto_user}
                                                alt="Your Image Alt Text"
                                                className=" w-52 h-52   border-2 border-[#E3E8EC]  drop-shadow shadow-md shadow-black rounded-[40px] inline-block" // Adjust the width as needed
                                            />
                                        </div>
                                        <div className='mt-6 w-full flex justify-center items-center flex-col'>
                                            <h1 className="text-xl font-bold uppercase">{username}</h1>
                                            <span className="text-sm  font-serif italic flex justify-center mt-3">{Email}</span>
                                        </div>
                                        <div className="mt-8 w-full flex justify-center items-center flex-col ">
                                            <LevelBar value={String(extractdecimalNumberFromLevel(Number(level)))} />
                                            <p className=' mt-4 text-white shadow-sm shadow-black   w-28  italic uppercase'>level : {getLevel(Number(level))}</p>
                                        </div>
                                        <div className='mt-6'>
                                            <div className="text-base  w-full font-bold flex  justify-center  items-center text-[#2c4d82]">
                                                {

                                                    (!flag) ?
                                                        (
                                                            <div className="text-base font-bold flex items-center w-full justify-center bgw-black  space-x-3  text-[#2c4d82]">
                                                                <div className="   w-28  h-10  bg-[#dbeafe]  flex  items-center justify-center  space-x-1  border rounded-2xl p-1 hover:scale-110 duration-300">
                                                                    <svg width="20" height="20" fill="black" enableBackground="new 0 0 24 24" id="Layer_1" version="1.0" viewBox="0 0 24 24" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><polyline clipRule="evenodd" fill="none" fillRule="evenodd" points="  23,7.5 17.7,13 14.9,10.2 " stroke="#000000" strokeMiterlimit="10" strokeWidth="2" /><circle cx="9" cy="8" r="4" /><path d="M9,14c-6.1,0-8,4-8,4v2h16v-2C17,18,15.1,14,9,14z" /></svg>
                                                                    <span className='normal-case'>Friends</span>
                                                                </div>
                                                                <Link href={`/chat?user=${numberPart}`} content='play' className="  w-28  h-10 flex justify-center items-center bg-[#dbeafe] border rounded-2xl p-1 hover:scale-110 duration-300" >Message</Link>
                                                                {/* <Link href='/game' content='play' className="  w-28  h-10 flex justify-center items-center  bg-[#dbeafe]  border rounded-2xl p-1 hover:scale-110 duration-300" >play</Link> */}
                                                                <button onClick={() => onlineUsersss.includes(numberPart) ? handelChallenge({ oppId: numberPart, socket: socket, currentUser: currentUser, selectUser: selectUser, setselectUser: setselectUser, router: router }) : undefined} content='play' className="  w-28  h-10 flex justify-center items-center  bg-[#dbeafe]  border rounded-full hover:scale-110 duration-300" >play</button>

                                                            </div>
                                                        ) :
                                                        (!flag1) ?
                                                            (
                                                                (!isfriend) ?
                                                                    (
                                                                        <div className="text-base font-bold flex items-cente w-full justify-center  space-x-10  text-[#2c4d82]">
                                                                            <div className=" w-32 space-x-1 h-10 p-1 justify-center bg-[#dbeafe]  flex  items-center  border rounded-2xl hover:scale-110 duration-300">
                                                                                <svg width="20" height="20" fill="black" enableBackground="new 0 0 24 24" id="Layer_1" version="1.0" viewBox="0 0 24 24" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><polyline clipRule="evenodd" fill="none" fillRule="evenodd" points="  23,7.5 17.7,13 14.9,10.2 " stroke="#000000" strokeMiterlimit="10" strokeWidth="2" /><circle cx="9" cy="8" r="4" /><path d="M9,14c-6.1,0-8,4-8,4v2h16v-2C17,18,15.1,14,9,14z" /></svg>
                                                                                <button className=" bg-[#dbeafe] border  " onClick={sendRequestForaccpet} >Confrim</button>
                                                                            </div>
                                                                            <button className="w-32 h-10 flex justify-center items-center p-1 bg-[#dbeafe] border rounded-2xl  hover:scale-110 duration-300 " onClick={received_request}>Delete</button>

                                                                        </div>) :
                                                                    (<div className="text-base font-bold flex items-center w-full justify-center bgw-black  space-x-3  text-[#2c4d82]">
                                                                        <div className="   w-28  h-10  bg-[#dbeafe]  flex  items-center justify-center  space-x-1  border rounded-full hover:scale-110 duration-300">
                                                                            <svg width="20" height="20" fill="black" enableBackground="new 0 0 24 24" id="Layer_1" version="1.0" viewBox="0 0 24 24" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><polyline clipRule="evenodd" fill="none" fillRule="evenodd" points="  23,7.5 17.7,13 14.9,10.2 " stroke="#000000" strokeMiterlimit="10" strokeWidth="2" /><circle cx="9" cy="8" r="4" /><path d="M9,14c-6.1,0-8,4-8,4v2h16v-2C17,18,15.1,14,9,14z" /></svg>
                                                                            <span className='normal-case'>Friends</span>
                                                                        </div>
                                                                        <Link href={`/chat?user=${numberPart}`} content='play' className="  w-28  h-10 flex justify-center items-center bg-[#dbeafe] border rounded-full hover:scale-110 duration-300" >Message</Link>
                                                                        <button onClick={() => onlineUsersss.includes(numberPart) ? handelChallenge({ oppId: numberPart, socket: socket, currentUser: currentUser, selectUser: selectUser, setselectUser: setselectUser, router: router }) : undefined} content='play' className="  w-28  h-10 flex justify-center items-center  bg-[#dbeafe]  border rounded-full hover:scale-110 duration-300" >play</button>


                                                                    </div>)
                                                            ) :

                                                            (

                                                                (
                                                                    (!isOpen) ?
                                                                        (
                                                                            <div className=' w-full space-x-10 flex justify-center items-center  flex-row'>
                                                                                <button className="w-32 h-10  flex justify-center items-center bg-white border rounded-2xl p-1 " onClick={sendRequest} >Add Friend</button>
                                                                                <Link href={`/chat?user=${numberPart}`} content='play' className="w-32 h-10  flex justify-center items-center bg-white border rounded-2xl p-1 hover:scale-110 duration-300" >Message</Link>
                                                                            </div>
                                                                        ) :
                                                                        (
                                                                            <div className=' bg-blacdk w-full space-x-10  flex justify-center items-center  flex-row '>

                                                                                <button className=" w-32 h-10  flex justify-center items-center  bg-white border rounded-2xl p-1 text-sm " onClick={cancelRequest} >Canacel requset</button>
                                                                                <Link href={`/chat?user=${numberPart}`} content='play' className=" w-32 h-10  flex justify-center items-center  bg-white border rounded-2xl p-1 hover:scale-110 duration-300" >Message</Link>
                                                                            </div>
                                                                        )
                                                                )
                                                            )

                                                }

                                            </div>

                                            <div className=" hidden md:flex justify-center items-center  ">

                                                <div className='mt-6 flex  flex-col items-center'>

                                                    <h1 className="flex  mt-[40px] ">Recent Activities</h1>
                                                    <div className={` ${(Number(level)) < 5 ? `w-80` : 'w-60'} mt-6 h-60   flex items-center justify-center relative`}>
                                                        <Image fill style={{ objectFit: "cover" }} className='' src={getTheGrad(Number(level))} alt='grad'></Image>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className=" md:hidden flex justify-center items-center flex-col ml-3 mt-6 ">

                                                <div className='mt-2 msl-1'>
                                                    {(check != 2) ? (<div>
                                                        <button onClick={() => freind_ranck1(2)} className=" mt-6 px-[133px]  py-2 text-base font-bold   bg-white  border hover:text-white  drop-shadow shadow-md shadow-black hover:bg-[#3b82f6] rounded-xl  hover:scale-110 duration-300 text-blue-600">Rank</button>
                                                    </div>) : null}
                                                    {(check == 2) ? (<div>
                                                        <button onClick={() => freind_ranck1(2)} className=" mt-6 px-[135px] py-2 text-base font-bold  bg-[#3b82f6]  hover:text-white hover:bg-blue-600 drop-shadow shadow-md shadow-black rounded-xl hover:scale-110 duration-300 text-white">Rank</button>
                                                    </div>) : null}
                                                    {(check != 1) ? (<div>
                                                        <button onClick={() => freind_ranck(1)} className=" mt-8 px-[125px] py-2 text-base font-bold   bg-white border  hover:text-white  hover:bg-[#3b82f6] drop-shadow shadow-md shadow-black rounded-xl hover:scale-110 duration-300 text-blue-600">Friends</button>
                                                    </div>) : null}
                                                    {(check == 1) ? (<div>
                                                        <button onClick={() => freind_ranck(1)} className=" mt-8 px-[125px] py-2  text-base font-bold   bordher-2 borsder-black bg-[#3b82f6] hover:text-blue-600 drop-shadow shadow-md shadow-black rounded-xl hover:bg-black hover:scale-110 duration-300 text-white">Friends</button>
                                                    </div>) : null}

                                                </div>
                                            </div>
                                        </div>
                                        {/* onClick={blockedfriend} */}

                                        <div className="mt-8 w-full justify-center items-center" onClick={() => setblocked(1)} >
                                            <button className="bg-[#dbeafe]   w-80 h-11  ml-3 sm:ml-0 transition-all active:scale-100 rounded-xl  text-[#2c4d82]  hover:scale-105 ">Blocked</button>
                                        </div>

                                    </div>
                                </div>
                                <div className=" hidden md:flex">

                                    <div className=" flex flex-col    h-full w-64 items-center   drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] bg-[#f9fafb]  mt-[85px] min-h-[845px]   p-6">
                                        {(check != 2) ? (<div>
                                            <button onClick={() => freind_ranck1(2)} className=" mt-60 px-[108px] py-2 text-base font-bold   bg-white  border hover:text-white  hover:bg-[#3b82f6]  hover:scale-110 duration-300 text-blue-600">Rank</button>
                                        </div>) : null}
                                        {(check == 2) ? (<div>
                                            <button onClick={() => freind_ranck1(2)} className=" mt-60 px-[110px] py-2 text-base font-bold  bg-[#3b82f6]  hover:text-white hover:bg-blue-600  hover:scale-110 duration-300 text-white">Rank</button>
                                        </div>) : null}
                                        {(check != 1) ? (<div>
                                            <button onClick={() => freind_ranck(1)} className=" mt-40 px-[99px] py-2 text-base font-bold   bg-white border  hover:text-white  hover:bg-[#3b82f6] hover:scale-110 duration-300 text-blue-600">Friends</button>
                                        </div>) : null}
                                        {(check == 1) ? (<div>
                                            <button onClick={() => freind_ranck(1)} className=" mt-40 px-[100px] py-2  text-base font-bold   bordher-2 borsder-black bg-[#3b82f6] hover:text-blue-600  hover:scale-110 duration-300 text-white">Friends</button>
                                        </div>) : null}




                                    </div>

                                </div>
                                {(<div className=" flex   flex-col justify-center items-center md:opacity-150 bg xl:mt-[80px] sm:mt-6   rounded-md min-h-[845px]  sm:bg-blue-50  w-[550px] xl:w-[700px] h-16 xl:rounded-2xl xl:rounded-s-[1px] p-6" >
                                    {
                                        check === 2 && <Rank amis_id={amis_id} amis={amis_id} id={numberPart} />
                                    }
                                    {
                                        check === 1 && <Friends amis_id={amis_id} amis={amis} currentUser={id} />

                                    }


                                </div>)
                                }

                            </div>
                            ) : (<footer className='w-full   min-h-screen  rounded-2xl  flex flex-col justify-center items-center space-y-3'>
                                <div className="mt-8 bg-green-w500 flex items-end -space-x-2">
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
                                <div className=' w-[50%]   text-center'>
                                    <h2> Sorry, We couldn't find this user </h2>
                                </div>

                            </footer>)
                }
            </div >
            {

                blocked == 1 && <div className=" absolute flex  justify-center items-center w-full h-full bg-gblack">
                    {

                        (<div className="flex   items-center   justify-center min-h-screen   min-w-screen  z-20  ">

                            <div className=" bg-white md:w-[400px] md:h:72   flex flex-col  justify-strt items-center  sm:w-[400px] sm:h-72  h-72 w-96  drop-shadow shadow-lg shaddow-black  rounded-lg   z-20 text-blue-600  ">
                                <div className='text-blue-500 text-xl mt-8  mr-44  font-black' >Confirm Blocked </div>
                                <div className=' w-96 hd-2 border-2 mt-5' > </div>
                                <div className='text-blue-500 text-sm mt-8  ml-16  w-full fonts-black' >Are you sure you  want to blocked this user ?</div>
                                <div className=' w-96 h-16 fbg-black mt-16 flex flex-row justify-center items-center space-x-6 '>
                                    <button onClick={() => setblocked(0)} className=' bg-white w-20  border-2 border-blue-600 h-10 rounded-lg'>
                                        <div>Cancel</div>
                                    </button>
                                    <button onClick={blockedfriend} className=' bg-blue-500 text-white w-20  h-10  border-2 border-blue-600 rounded-lg'>
                                        <div>Ok</div>
                                    </button>

                                </div>
                            </div>
                        </div>)
                    }

                </div>
            }

        </div >
    );
};



export async function getServerSideProps(context: any) {
    const currentFileName = context.query.user;
    return {
        props: {
            currentFileName,
        },
    };
}

export default YourComponent;
