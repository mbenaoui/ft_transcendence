import { Constant } from '@/constants/constant';
import { userData, userProps } from '@/interface/data';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { any, number, set } from 'zod';
function Mutaulfriends({ user, amis }: { user: userProps, amis: Array<userProps> }) {

    let flag1 = 0;
    const [amis_id, setAmisid] = useState<Array<userProps>>([])

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${Constant.API_URL}/friends/accepted-friends/${user.id}`, {
                    credentials: 'include',
                });
                const content = await response.json();

                setAmisid(Array.from(content));

            }
        )();
    }, [user]);
    let filterUser: any = amis_id.filter((user: userProps) => {

        // user.isf = true


        if (Array.isArray(amis)) {

            amis.map((usr: any) => {
                if (usr.id == user.id) {
                    flag1++;



                }


            });
        } else {

        }
    })

    return (

        <p className=" indent-0  text-sm text-[#b2b4bc]">{flag1} matual friends
        </p>
    );

}

const User = () => {

    const [allfriends, setallfriends] = useState<any>([])
    const [friend_reciver, setfriend_reciver] = useState<Array<any>>([]);
    const [friend_request, setFriend_request] = useState<Array<any>>([]);
    const [received_blocked, setreceived_blocked] = useState<Array<any>>([]);
    const [sendr_blocked, setsendr_blocked] = useState<Array<any>>([]);
    const [currentUser1, setCurrentUser1] = useState<userProps>(userData);
    const [amis, setAmis] = useState<Array<any>>([]);
    const [users, setUsers] = useState<Array<any>>([]);
    const [users1, setUsers1] = useState<Array<any>>([]);
    const [isOpen, setIsOpen] = useState(0)
    const [isOpen4, setIsOpen4] = useState(0)
    let _add: Array<any>
    let flag = true;

    // 
    const router = useRouter();

    const profailamis = (username: string, userId: number) => {
        // Implement the functionality for profailamis
        // For example, you can navigate to a new page or perform an action here
        router.push(`/users/${username}.${userId}`);
    };
    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${Constant.API_URL}/users/${currentUser1.id}`, {
                    credentials: 'include',
                });
                const content = await response.json();
                setUsers(content);
            }
        )();
    }, [currentUser1]);
    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`${Constant.API_URL}/users/other/userId`, {
                        credentials: 'include',
                    });
                    if (response.ok) {
                        const content = await response.json();
                        setallfriends(content);
                    }
                } catch (error) {

                }
            }
        )();
    }, [currentUser1, isOpen]);


    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`${Constant.API_URL}/auth/user`, {
                        credentials: 'include',
                    });
                    if (response.ok) {
                        const content = await response.json();
                        setCurrentUser1(content);
                    }
                } catch (error) {

                }
            }
        )();
    }, []);
    const sendRequest = async (numberPart: number) => {
        try {
            const response = await fetch(`${Constant.API_URL}/friends/send-request/${numberPart}`, {
                method: 'POST',
                credentials: 'include',
            });


            if (response.ok) {
                if (isOpen == 0)
                    setIsOpen(1);

                else if (isOpen == 1)
                    setIsOpen(0);

            } else {
                console.error('Failed to send friend request.');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    const CanacelRequest = async (numberPart: number) => {
        try {
            const response = await fetch(`${Constant.API_URL}/friends/delete-friend-request/${numberPart}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                if (isOpen == 0)
                    setIsOpen(1);

                else if (isOpen == 1)
                    setIsOpen(0);

            } else {
                console.error('Failed to delete-friend-request.');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };
    const sendRequestForaccpet = async (numberPart: number) => {
        try {

            const response = await fetch(`${Constant.API_URL}/friends/accept-friend-request/${numberPart}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                if (isOpen == 0)
                    setIsOpen(1);

                else if (isOpen == 1)
                    setIsOpen(0);

            } else {
                console.error('Failed to send friend request.');
            }
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };
    const CanacelRequest1 = async (numberPart: number) => {
        try {
            const response = await fetch(`${Constant.API_URL}/friends/delete-friend-request/${numberPart}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                if (isOpen == 0)
                    setIsOpen(1);

                else if (isOpen == 1)
                    setIsOpen(0);

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
                try {

                    const response = await fetch(`${Constant.API_URL}/friends/accepted-friends/${currentUser1.id}`, {
                        credentials: 'include',
                    });
                    if (response.ok) {

                        const content = await response.json();
                        setAmis(content);
                    }
                } catch (error) {
                }
            }
        )();
    }, [currentUser1, isOpen]);


    useEffect(() => {
        (
            async () => {
                try {

                    const response = await fetch(`${Constant.API_URL}/friends/received-requests`, {
                        credentials: 'include',
                    });
                    const counte = await response.json();
                    if (response.status == 200) {

                        setfriend_reciver(counte)
                        return;
                    }
                } catch (error) {
                }
            }
        )();
    }, [amis, currentUser1, allfriends, isOpen]);
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
    }, [currentUser1, isOpen,]);
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
    }, [currentUser1, isOpen]);
    useEffect(() => {
        (
            async () => {
                try {

                    const response = await fetch(`${Constant.API_URL}/friends/send-requests`, {
                        credentials: 'include',
                    });
                    const counte = await response.json();
                    if (response.status == 200) {
                        setFriend_request(counte)
                        // setrequestt(cont)
                        return;
                    }
                } catch (error) {
                }
            }
        )();
    }, [amis, currentUser1, allfriends, isOpen]);




    return (
        <div className='    flex justify-center bdg-white w-full   items-center  h-screen  flex-col'>

            <div className='  flex-auto justify-start items-start     w-full   min-h-auto   flex-col  sm:w-auto md:auto   mt-16  rounded-xl drop-shadow-2xl  bg-clip-border  border-2 bg-white  p-4  dark:bg-CusColor_dark  border-solid'>
                <div className='flex flex-auto bxg-red-600 flex-row mt-7  sm:justify-start  sm:items-start justify-center items-center'>


                    <div className="border-4    text-black  text-base  w-96 flex justify-center items-center drop-shadow shadow-md shadow-black   rounded-lg bg-white borsder-blue-600  ...">Friend requests</div>

                    <div className="sm:flex flex-auto  roundesd-2xl border-t-4  mt-3  hidden w-64 h-1 drop-shadow shadow-md shadow-black   border-[#eee] ..."></div>
                </div>

                <div className={`  hidden  ${friend_reciver.length != 0 ? ' sm:grid  md:grid  m-3  mt-7  lg-grid lg:grid-cols-5   lg:space-x-0 lg:space-y-0     lg:gap-x-4 lg:gap-y-4    sm:grid-cols-3  sm:space-x-0  sm:space-y-0    sm:gap-x-4 sm:gap-y-4  md:space-x-0 md:space-y-0    md:gap-x-4 md:gap-y-4    md:grid-cols-4' : ' sm:flex w-full bg-bdlack  '}  md:flex-row justify-center  `}>
                    {


                        (friend_reciver.length) ? friend_reciver.map((user: any, index: any) => (
                            <div key={index} className='flex    rounded-xl items-start  '>

                                <div className=' bg-white border-4  bordder-blue-400 w-48 h-[300px] drop-shadow shadow-md shadow-black  rounded-xl  flex  flex-col  '>
                                    <button onClick={() => profailamis(user.sender.username, user.sender.id)}>

                                        <div className='flex justify-center mt-3'>
                                            <img
                                                src={user.sender.foto_user}
                                                alt="Your"
                                                className="w-36  h-36    border-2 border-blue-600 drop-shadow shadow-md shadow-black rounded-[20px] "
                                            />

                                        </div>
                                    </button>

                                    <div className=" indent-0  mt-3 bg-b flex justify-center  items-center flex-col text-back">
                                        <button onClick={() => profailamis(user.sender.username, user.sender.id)} className='normal-case    flex justify-start items-start no-underline   font-semibold font-serif' >
                                            <p className='text-black text-sm'>
                                                {user.sender.username}
                                            </p>
                                        </button>
                                        <Mutaulfriends user={user.sender} amis={amis} />
                                        <div className='flex  justify-center flex-col mt-1 rounded-md bg-xwhite'>

                                            <button>
                                                <div onClick={() => sendRequestForaccpet(user.sender.id)} className=' flex justify-center items-center   text-sm font-bol bg-blue-500  rounded-md w-36 h-8 hover:bg-slate-100 hover:scale-110 duration-300'>
                                                    <svg fill="#000000" width="20" height="20" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="M624 208h-64v-64c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v64h-64c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64v64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-64h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400 48c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" /></svg>
                                                    <div className=' text-black ml-1'>Confirm</div>
                                                </div>
                                            </button>
                                            <button>

                                                <div onClick={() => CanacelRequest1(user.sender.id)} className=' flex justify-center items-center mt-1 text-sm font-bol bg-[#E3E8EC] rounded-md w-36 h-8 hover:bg-slate-100 hover:scale-110 duration-300'>
                                                    <div className=' text-black ml-1 text-base'>Delete</div>
                                                </div>
                                            </button>
                                        </div>

                                    </div>

                                </div>

                            </div>



                        )) : (

                            <footer className='  w-full  rounded-2xl   flex flex-col justify-center items-center space-y-3'>
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
                                <div className=' w-[50%]   text-center'>
                                    <h2> Sorry, We couldn't find any user </h2>
                                </div>

                            </footer>
                        )
                    }
                </div>
                <div className='  sm:hidden md:hidden flex space-y-5 justify-center items-center  flex-col  lg:hidden   mt-7 '>

                    {
                        (friend_reciver.length) ? friend_reciver.map((user: any, index: any) => (



                            <div key={index} className='   w-[368px] h-24     rounded-xl border-2 border-[#005AB5] drop-shadow shadow-md shadow-black  mt-4 flex flex-row '>

                                <div className='bg-white rounded-l-xl border-r-[2px] border-blue-600  w-full h-24  flex flex-row'>
                                    <button onClick={() => profailamis(user.sender.username, user.sender.id)} >
                                        <div className='flex justify-start items-center  ml-3'>
                                            <img
                                                src={user.sender.foto_user}
                                                alt="Your"
                                                className="w-[80px]  h-[80px] drop-shadow shadow-md shadow-black  bordser-2 border-sblue-600   rounded-[15px]"
                                            />
                                        </div>
                                    </button>
                                    <div className='flex justify-start  flex-col   '>
                                        <button onClick={() => profailamis(user.sender.username, user.sender.id)} >
                                            <div className='normal-case no-underline  flex items-center font-semibold font-serif  ml-3  mt-7' >
                                                <p className='text-black text-sm'>
                                                    {user.sender.username}
                                                </p>

                                            </div>
                                        </button>
                                        <div className='ml-3'>

                                            <Mutaulfriends user={user.sender} amis={amis} />
                                        </div>

                                    </div>

                                </div>

                                <div className=' bg-white  h-24 w-32 rounded-r-xl flex flex-col'>
                                    <button>
                                        <div onClick={() => sendRequestForaccpet(user.sender.id)} className='h-12  hover:bg-white  flex justify-center bdg-blue-600 items-center rounded-r-xl hover:scale-110 duration-300'>
                                            <svg fill="#0284c7" width="20" height="20" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="M624 208h-64v-64c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v64h-64c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64v64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-64h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400 48c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" /></svg>
                                            <div className=' text-[#0369a1]  text-sm ml-1'>Confirm</div>

                                        </div>
                                    </button>
                                    <div className="border-b-2 border-blue-600 ..."></div>
                                    <button>
                                        <div onClick={() => CanacelRequest1(user.sender.id)} className='text-[#f87171]  flex  h-10 justify-center rounded-r-xl hover:scale-110 hover:bg-white duration-300 items-center'>
                                            Delete
                                        </div>
                                    </button>
                                </div>


                            </div>

                        )) : (

                            <footer className='w-full   rounded-2xl  flex flex-col justify-center items-center space-y-3'>
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
                                    <h2> Sorry, We couldn't find any user </h2>
                                </div>

                            </footer>

                        )

                    }
                </div>

                <div className='flex flex-auto bxg-red-600 flex-row mt-7  sm:justify-start  sm:items-start justify-center items-center'>


                    <div className="border-4    text-black  text-base  w-96 flex justify-center items-center drop-shadow shadow-md shadow-black   rounded-lg bg-white borsder-blue-600  ...">Friend requests</div>

                    <div className="sm:flex flex-auto  roundesd-2xl border-t-4  mt-3  hidden w-64 h-1 drop-shadow shadow-md shadow-black   border-[#eee] ..."></div>
                </div>
                <div className={`  hidden  ${friend_request.length != 0 ? '   sm:grid  md:grid  m-3 mt-7  lg-grid lg:grid-cols-5   lg:space-x-0 lg:space-y-0     lg:gap-x-4 lg:gap-y-4    sm:grid-cols-3  sm:space-x-0  sm:space-y-0    sm:gap-x-4 sm:gap-y-4  md:space-x-0 md:space-y-0    md:gap-x-4 md:gap-y-4    md:grid-cols-4' : ' sm:flex w-full bg-bdlack  '}  md:flex-row justify-center  `}>
                    {


                        (friend_request.length) ? friend_request.map((user: any, index: any) => (
                            <div key={index} className='flex    rounded-xl items-start  '>

                                <div className=' bg-white border-4  w-48 h-[300px] drop-shadow shadow-md shadow-black  rounded-xl  flex  flex-col   '>
                                    <button onClick={() => profailamis(user.receiver.username, user.receiver.id)}>

                                        <div className='flex justify-center mt-3'>
                                            <img
                                                src={user.receiver.foto_user}
                                                alt="Your"
                                                className="w-36  h-36   border-2 border-blue-600 drop-shadow shadow-md shadow-black  rounded-[20px] "
                                            />
                                        </div>
                                    </button>

                                    <div className=" indent-0  mt-4 bg-b flex justify-center  items-center flex-col text-back  ">
                                        <button onClick={() => profailamis(user.receiver.username, user.receiver.id)} className='normal-case    flex justify-start items-start no-underline   font-semibold font-serif' >
                                            <p className='text-black text-sm'>
                                                {user.receiver.username}
                                            </p>
                                        </button>
                                        <Mutaulfriends user={user.receiver} amis={amis} />
                                        <div className='flex  justify-center flex-col mt-5 rounded-md bg-xwhite'>


                                            <button>

                                                <div onClick={() => CanacelRequest(user.receiver.id)} className=' flex justify-center items-center mt- text-sm font-bol bg-blue-600  rounded-md w-36 h-8 hover:bg-slate-100 hover:scale-110 duration-300'>
                                                    <div className=' text-black ml-1 text-base'>Cancel request</div>
                                                </div>
                                            </button>
                                        </div>

                                    </div>

                                </div>

                            </div>



                        )) : (

                            <footer className='w-full   rounded-2xl mt-5 py-10 flex flex-col justify-center items-center space-y-3'>
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
                                <div className=' w-[50%]   text-center'>
                                    <h2> Sorry, We couldn't find any user </h2>
                                </div>

                            </footer>
                        )
                    }
                </div>
                <div className='  sm:hidden md:hidden flex  space-y-5 justify-center  items-center flex-col  m-3 mt-7  lg:hidden     '>

                    {
                        (friend_request.length) ? friend_request.map((user: any, index: any) => (
                            <div key={index} className=' w-[368px] h-24     -sm-3  drop-shadow shadow-md shadow-black  rounded-xl border-[1px] border-blue-600  mt-4 flex flex-row '>
                                <div className='bg-white rounded-l-xl border-r-[2px] border-blue-600 w-full h-24  flex flex-row '>
                                    <button onClick={() => profailamis(user.receiver.username, user.receiver.id)} >
                                        <div className='flex justify-start items-center ml-3'>
                                            <img
                                                src={user.receiver.foto_user}
                                                alt="Your"
                                                className="w-[80px]  h-[80px]   drop-shadow shadow-md shadow-black  rounded-[15px]"
                                            />
                                        </div>
                                    </button>
                                    <div className='flex justify-start  flex-col  '>
                                        <button onClick={() => profailamis(user.receiver.username, user.receiver.id)} >
                                            <div className='normal-case no-underline font-semibold font-serif  ml-3 flex justify-start justify-items-center items-start  mt-7' >
                                                <p className='text-black text-sm'>
                                                    {user.receiver.username}
                                                </p>
                                            </div>
                                        </button>
                                        <div className='ml-3'>

                                            <Mutaulfriends user={user.receiver} amis={amis} />
                                        </div>

                                    </div>



                                </div>
                                <div className=' bg-white  h-24 w-32 rounded-r-xl flex flex-col'>


                                    <button>
                                        <div onClick={() => CanacelRequest(user.receiver.id)} className=' flex  h-24 justify-center rounded-r-xl hover:scale-110 hover:bg-white duration-300 items-center'>
                                            <div className='text-[#f87171] text-sm ml-1'> Cancel request</div>
                                        </div>
                                    </button>
                                </div>


                            </div>

                        )) : (

                            <footer className='w-full   rounded-2xl  flex flex-col justify-center items-center space-y-3'>
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
                                    <h2> Sorry, We couldn't find any user </h2>
                                </div>

                            </footer>

                        )


                    }
                </div>

                <div className='flex flex-auto bxg-red-600 flex-row mt-7 sm:justify-start  sm:items-start justify-center items-center'>

                    <div className="border-4    text-black  text-base  w-96 flex justify-center items-center drop-shadow shadow-md shadow-black   rounded-lg bg-white borsder-blue-600 ...">People you may know</div>

                    <div className="sm:flex flex-auto  roundesd-2xl border-t-4  mt-3  hidden w-64 h-1 drop-shadow shadow-md shadow-black   border-[#eee] ..."></div>
                </div>


                <div className={`  hidden  ${allfriends.length != 0 ? '   sm:grid  md:grid  m-3 mt-7  lg-grid lg:grid-cols-5   lg:space-x-0 lg:space-y-0     lg:gap-x-4 lg:gap-y-4    sm:grid-cols-3  sm:space-x-0  sm:space-y-0    sm:gap-x-4 sm:gap-y-4  md:space-x-0 md:space-y-0    md:gap-x-4 md:gap-y-4    md:grid-cols-4' : ' sm:flex w-full bg-bdlack  '}  md:flex-row justify-center  `}>
                    {
                        (allfriends.length) ? allfriends.map((user: userProps, index: any) => (


                            <div key={index} className='flex    rounded-xl items-start  '>

                                <div className=' bg-white border-4 w-48 h-[300px]  drop-shadow shadow-md shadow-black rounded-xl  flex  flex-col  '>
                                    <div className='flex justify-center  mt-3'>
                                        <img
                                            src={user.foto_user}
                                            alt="Your"
                                            className="w-36  h-36  border-2 border-blue-600  drop-shadow shadow-md shadow-black  rounded-[20px] "
                                        />
                                    </div>

                                    <div className=" indent-0  mt-3 bg-b  flex  justify-center items-center flex-col text-back">
                                        <button className='normal-case    flex justify-start items-start no-underline   font-semibold font-serif' >
                                            <p className='text-black text-sm'>
                                                {user.username}
                                            </p>
                                        </button>

                                        <Mutaulfriends user={user} amis={amis} />
                                        <div className='flex  justify-center flex-col mt-1 rounded-md bg-xwhite'>

                                            <button>
                                                <div onClick={() => sendRequest(user.id)} className=' flex justify-center items-center  text-sm font-bol bg-blue-600 rounded-md w-36 h-8 hover:bg-slate-100 hover:scale-110 duration-300'>
                                                    <svg fill="#000000" width="20" height="20" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="M624 208h-64v-64c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v64h-64c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64v64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-64h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400 48c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" /></svg>
                                                    <div className=' text-[030B11] ml-1'>add friend</div>
                                                </div>
                                            </button>
                                            <button>

                                                <div onClick={() => profailamis(user.username, user.id)} className=' flex justify-center items-center mt-1 text-sm font-bol bg-blue-600 rounded-md w-36 h-8 hover:bg-slate-100 hover:scale-110 duration-300'>
                                                    <div className=' text-black ml-1 text-base'>Profail</div>
                                                </div>
                                            </button>
                                        </div>

                                    </div>

                                </div>


                            </div>

                        )) : (

                            <footer className='w-full   rounded-2xl mt-8 rpy-10 flex flex-col justify-center items-center space-y-3'>
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
                                <div className=' w-[50%]   text-center'>
                                    <h2> Sorry, We couldn't find any user </h2>
                                </div>
                                <div className="space-x-3">
                                </div>
                            </footer>
                        )
                    }
                </div>
                <div className='  sm:hidden md:hidden   space-y-5 m-3 mt-3 flex justify-center justify-items-center flex-col items-center  lg:hidden   '>

                    {
                        (allfriends.length) ? allfriends.map((user: userProps, index: any) => (

                            <div key={index} className=' w-[368px] max-w-96  h-24  -mxs-3   drop-shadow shadow-md shadow-black  rounded-xl border-[1px] border-blue-600  mt-4 flex flex-row '>
                                <div className='bg-white rounded-l-xl border-r-[2px] border-r-blue-600 w-full  h-24  flex flex-row'>
                                    <div className='flex justify-start items-center m-4'>
                                        <img
                                            src={user.foto_user}
                                            alt="Your"
                                            className="w-[80px]  h-[75px]   drop-shadow shadow-md shadow-black  rounded-[15px]"
                                        />
                                    </div>
                                    <div className='flex justify-start  items-start justify-items-start flex-col   '>
                                        <div className='normal-case no-underline font-semibold font-serif  mt-7' >
                                            <p className='text-black text-sm'>
                                                {user.username}
                                            </p>
                                        </div>
                                        <div>
                                            <Mutaulfriends user={user} amis={amis} />
                                        </div>

                                    </div>

                                </div>
                                <div className=' bg-white  h-24 w-32 rounded-r-xl flex flex-col'>
                                    <button>
                                        <div onClick={() => sendRequest(user.id)} className='h-12  hover:bg-white  flex justify-center items-center rounded-r-xl hover:scale-110 duration-300'>
                                            <svg fill="#0284c7" width="20" height="20" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="M624 208h-64v-64c0-8.8-7.2-16-16-16h-32c-8.8 0-16 7.2-16 16v64h-64c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h64v64c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-64h64c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zm-400 48c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" /></svg>
                                            <div className=' text-[#0369a1]  text-sm ml-1'>add friend</div>

                                        </div>
                                    </button>
                                    <div className="border-b-2 border-blue-600 ..."></div>
                                    <button>
                                        <div onClick={() => profailamis(user.username, user.id)} className='text-[#0369a1] flex   h-10 justify-center rounded-r-xl hover:scale-110 hover:bg-white duration-300 items-center'>
                                            Profile
                                        </div>
                                    </button>
                                </div>



                            </div>

                        )) : (

                            <footer className='w-full   rounded-2xl mt-5 pys-10 flex flex-col justify-center items-center space-y-3'>
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
                                    <h2> Sorry, We couldn't find any user </h2>
                                </div>
                                <div className="space-x-3">
                                </div>
                            </footer>

                        )


                    }
                </div>


            </div>
        </div>
    )
}
export default User;


function strjoin(separator: any, strings: any[]) {
    return strings.join(separator);
}
