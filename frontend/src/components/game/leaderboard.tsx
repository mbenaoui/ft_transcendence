import React from 'react'

import { fetchAllAmis, fetchAllUsers, fetchCurrentUser } from '@/hooks/userHooks';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AppProps, userProps } from '@/interface/data';
import History from '@/components/game/history';
import { useRouter } from 'next/navigation';
import { Constant } from '@/constants/constant';
let users_id1: string = "";

const Leaderboard = ({ currentUser }: { currentUser: userProps }) => {
    return (
        <div className='w-full h-full flex justify-center  items-center '>
            <Rank id={currentUser.id} t={currentUser.id} />

        </div>
    )
}

export default Leaderboard


function Profiles({ Leaderboard, t }: { Leaderboard: any, t: number }) {
    const [users_id, setUsers_id] = useState<userProps>(Leaderboard[0])

    const [id, setid] = useState(0);
    const [on, seton] = useState(0);
    useEffect(() => {

        (
            async () => {
                try {
                    const response = await fetch(`${Constant.API_URL}/auth/user`, {
                        credentials: 'include',
                    });
                    const content = await response.json();
                    if (response.ok)
                        setid(content.id);
                } catch (error) {

                }

            }
        )();
    });
    useEffect(() => {
        (
            setUsers_id(Leaderboard[0])

        );
    }, [id]);

    const router = useRouter();

    const profailamis = (username: string, userId: number) => {
        // Implement the functionality for profailamis
        // For example, you can navigate to a new page or perform an action here
        router.push(`/users/${username}.${userId}`);
    };

    return (
        // <div className='mt-2' >
        <div className=' w-full h-full flex justify-center items-center  '>


            <div className='flex  justify-center h-[90%] items-center bg-btack  w-full  flex-row'>
                <div className="   2xl:w-[60%] sm:h-auto  md:h-full  w-[97%] md:w-[90%]  justify-center items-center     bg-blue-500   sm:mt-8   rounded-2xl flex flex-col ">
                    <div className=' flex  bg-bwlack   justify-center items-center hd-full flex-col'>
                        {
                            on == 0 && Leaderboard.map((value: any, index: any) => (

                                <div key={index} className=' flex -mt-3 wh-[40%] w-full   fledx-row ml-14  spface-x-3'>
                                    {


                                        index + 1 == 2 && <div className=' flex flex-col'>
                                            <div className=' flex -mt-[221px]   flex-col bg-bladck justify-center items-center '>

                                                <img
                                                    src={value.foto_user}
                                                    alt="Your"
                                                    className="w-14   h-14   rounded-full inline-block"
                                                />
                                                <div className=' text-sm mt-2  text-white  font-serif '>{value.username}</div>
                                                <div className=' text-sm mt-[3px] text-white  justify-center items-center mfl-6'>{value.won} Win</div>
                                            </div>
                                            <div className='  mt-[8k3px] trapezoid1'></div>
                                            <div className=' flex  bg-blue-300  w-[100px]  h-24 text-8xl text-white  justify-center   font-serif items-center  '>
                                                <span className=' -mt-5'>2</span></div>
                                        </div>
                                    }
                                    {

                                        index + 1 == 1 && <div className=' ml-[100px]'>
                                            <div className=' flex mt-[22px]   flex-col bg-bladck justify-center items-center '>

                                                <img
                                                    src={value.foto_user}
                                                    alt="Your"
                                                    className="w-14   h-14 mfl-3  rounded-full inline-block"
                                                />
                                                <div className=' text-sm mt-2  text-white  font-serif '>{value.username}</div>
                                                <div className=' text-sm mt-[3px] text-white  justify-center items-center mfl-6'>{value.won} Win</div>
                                            </div>
                                            <div className=' mt-0 trapezoid'></div>
                                            <div className=' flex  bg-blue-400  w-[125px]  h-32 text-9xl text-white justify-center font-serif  items-center '>
                                                <span className='-mt-6'>1</span></div>
                                        </div>
                                    }
                                    {

                                        index + 1 == 3 && <div className='-mt-[205px]  ml-[225px]'>

                                            <div className=' flex -mwt-[110px]  ml-[250pwx]   flex-col bg-bladck justify-center items-center '>

                                                <img
                                                    src={value.foto_user}
                                                    alt="Your"
                                                    className="w-14   h-14   rounded-full inline-block"
                                                />
                                                <div className=' text-sm mt-2  text-white  font-serif '>{value.username}</div>
                                                <div className=' text-sm mt-[3px] text-white  justify-center items-center mfl-6'>{value.won} Win</div>
                                            </div>
                                            <div className='  mt-[15wpx] trapezoid2'></div>
                                            <div className=' flex  bg-blue-300  w-[100px] h-20 text-6xl text-white  font-serif   items-start  justify-center'>
                                                <span className='-mt-1'>3</span></div>
                                        </div>
                                    }
                                </div>

                            ))
                        }
                        <div className={` bg-white w-full md:beg-slate-500 md:w-[350px] lg:w-96 msd:w-84  mt-11   ${on == 1 ? ' h-[600px] ' : ' h-[200px] lg:h-[550px] sm:h-[250px] md:h-[403px]'}    lg:bg-white  flex   overflow-y-scroll jusdtify-center items-center   flex-col scrollbar-hide  rounded-t-3xl`}>

                            {
                                on == 0 && <button className=' flex justify-start w-10 bg-slate-400 h-3 mt-2  rounded-3xl' onClick={() => seton(1)}></button>
                            }
                            {
                                on == 1 && <button className=' flex justify-start w-10 bg-slate-400 h-3 mt-2  rounded-3xl' onClick={() => seton(0)}></button>
                            }
                            {
                                Leaderboard.map((value: any, index: any) => (
                                    <div className="flex flex-row" key={index}>
                                        <div className='flex bg-blak w-96  hover:scale-105 hover:boeder-2 hover:bg-blue-600 hover:justify-center hover:flex hover:items-center hover:h-12  hover:z-20 hover:-ml-5 hover:w-[400px]  duration-500  hover:rounded-md  bg-dslate-400  mt-3  h-10 ' onMouseOver={() => setUsers_id(value)}>
                                            <div className="flex  justify-between items-center flex-row space-x-7 ">
                                                <div className=' lg:ml-10  md:ml-5 ml-10 mft-2 flex  border-2  h-6 justify-center items-center w-6 rounded-full'>{index + 1} </div>
                                                <div className='-mwt-3 flex flex-row w-40  vbg-slate-500 justify-start items-center space-x-3'>
                                                    <img className="h-8 w-8 borwder-2 bofrder-blue-600 rounded-full drop-shadow shadow-md shadow-black  " src={value.foto_user} alt="" />
                                                    <button onClick={() => profailamis(users_id.username, users_id.id)} className={` text-sm  } font-serif itwalic`}
                                                    > {value.username}</button>
                                                </div>
                                                <div className=" flex w-24 ml-10 bgf-black space-x-2">
                                                    <img className="h-8 w-8 borsder-2 bofrder-blue-600 rounded-full drop-shsadow shasdow-md shadow-black  " src="https://i.pinimg.com/564x/b2/1a/6d/b21a6d4cf152b2e3f4a9241e37a6fe64.jpg" alt="" />
                                                    <div className=' flex  mt-1 w-7 justify-center text-sm  font-serif italic'>{value.won}</div>
                                                    <span className='mt-1 text-sm   font-serif italic'>win</span>
                                                </div>

                                            </div>
                                        </div>
                                    </div>

                                ))
                            }
                        </div>

                    </div >
                </div >
                {

                    users_id && <div className="hidden  md:hidden sm:flex 2xl:flex flex-auto w-[40%] bg-swlate-300 h-full bg-blyack  justify-center  items-center rounded-xl">
                        <div className=' bg-blue-300 w-[100%] flex justify-start items-center flex-col  mt-[60px] rounded-r-xl p-3 sm:h-full 2xl:h-[80%]'>
                            <img className="h-40  w-40 mt-12  border-2 bofrder-blue-600 rounded-full drop-shadow shadow-md sshadow-black  " src={users_id.foto_user} alt="" />
                            <div className=' textf-white mt-4  text-2xl capitalize  font-bold text-black'>{users_id.username}</div>
                            <div className=' text-dwhite mt-1  text-sm font-serif italic '>{users_id.email}</div>
                            <div className='flex flex-row space-x-2 mt-7'>
                                {/* <img className="h-8 w-8 border-2  border-blue-600 rounded-full drop-shsadow shasdow-md shadow-black  " src="https://i.pinimg.com/564x/b2/1a/6d/b21a6d4cf152b2e3f4a9241e37a6fe64.jpg" alt="" /> */}
                                <div className=' text-dwhite mt-1  text-7xl tedxt-base font-bold italic '>{users_id.won}</div>
                                {/* <div className='w-8 h-8 mst-1  border-2 border-blue-600 bg-white flex justify-center items-center    rounded-full'> */}

                                {/* <span className=' text-sm   font-serif italic'>win</span> */}
                                {/* </div> */}
                            </div>
                            <button>

                                <div onClick={() => profailamis(users_id.username, users_id.id)} className=' flex justify-center items-center mt-12 text-sm font-bol bg-white rounded-full w-44 h-8 hover:bg-slate-100 hover:scale-110 duration-300'>

                                    <div className=' text-black ml-1 text-base font-serif  itdalic'>view Profail</div>
                                </div>
                            </button>
                            {/* {users_id.won} */}

                        </div>
                    </div>
                }
            </div>
        </div>
    );

}
const Rank = ({ id, t }: { id: number, t: number }) => {

    const [users_id, setUsers_id] = useState<Array<userProps>>([]);

    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`${Constant.API_URL}/users/${0}`, {
                        credentials: 'include',
                    });
                    if (response.ok) {
                        const content = await response.json();
                        setUsers_id(Array.from(content));
                    }
                } catch (error) {

                }
            }
        )();
    }, [id]);

    return (
        <div className=" w-full h-full justify-center items-center flex ">

            <Profiles Leaderboard={between(users_id)} t={t} />
        </div>
    );
};

function between(data: Array<userProps> | undefined) {
    if (data) {
        return data.sort((a, b) => b.level - a.level);
    } else {
        console.error("Cannot sort undefined data array");
        return [];
    }
}