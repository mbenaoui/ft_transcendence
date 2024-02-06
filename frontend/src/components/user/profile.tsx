import Link from "next/link";
import React, { useEffect, useState } from 'react';
import { fetchAllAmis, fetchCurrentUser } from "@/hooks/userHooks";
import { userData, userProps } from "@/interface/data";

import Image from 'next/image'
import { Constant } from "@/constants/constant";
import { getLevel } from "../game/listOfFriends";

import Friends from "./friend";
import Rank from "./rank";

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
    <div className="bg-white h-5  drop-shadow shadow-md shadow-black    w-80 rounded-lg">
      <div className="bg-[#0ea5e9] h-5 rounded-lg " style={{ width: progressWidth }}>
      </div>
    </div>
  );
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

const UseProfile = () => {
  const [amis, setAmis] = useState<any>([])
  const [level, setlevel] = useState();
  const [check, setCheck] = useState(2);
  const [check1, setCheck1] = useState(0);
  const [check2, setCheck2] = useState(0);
  const [currentUser, setCurrentUser] = useState<userProps>(userData);
  const [foto_user, setFoto_user] = useState("");
  const [id, setid] = useState(0);
  const [logout, setLogout] = useState(0);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    (
      async () => {
        try {

          const response = await fetch(`${Constant.API_URL}/auth/user`, {
            credentials: 'include',
          });
          if (response.ok) {
            const content = await response.json();
            setCurrentUser(content);
          }
        } catch (error) {

        }
      }
    )();
  }, []);

  useEffect(() => {
    (
      async () => {
        try {

          const response = await fetch(`${Constant.API_URL}/auth/user`, {
            credentials: 'include',
          });
          if (response.ok) {
            const content = await response.json();
            setFoto_user(content.foto_user);
            setid(content.id);
            setEmail(content.email);
            setUsername(content.username)
            setlevel(content.level)
            const stringValue2: string = String(level);
            const level3 = stringValue2.split('.');
          }
        } catch (error) {

        }
      }
    )();
  }, []);
  useEffect(() => {
    (
      async () => {
        setCheck1(0);
        setCheck2(0);
      }
    )();
  }, [id]);
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
  const handelLogOutUser = async () => {
    try {
      const response = await fetch(`${Constant.API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  }
  useEffect(() => {
    (
      async () => {
        try {
          const response = await fetch(`${Constant.API_URL}/friends/accepted-friends/${id}`, {
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
  }, [id]);

  const getLevel = (level: number | any): string => {
    if (!level)
      return '0'
    return level.toString().slice(0, level.toString().indexOf('.') + 3)
  }
  const extractdecimalNumberFromLevel = (_level: number) => {
    if (!_level)
      return '0'
    var level: string = _level.toString() + '0'
    const ret = level.toString().indexOf('.') == -1 ? 0 : level.toString().slice(level.toString().indexOf('.') + 1, level.toString().indexOf('.') + 3)
    return Number(ret) > 2 ? ret : 0
  }
  return (

    <div className=" flex flex-col w-full min-h-screen">

      <div className={`flex flex-wrap gl-5  sm:ml-0 ${logout == 1 ? 'blur-sm' : null}  justify-center min-h-screen  w-full   items-center  `}>
        <div className='  flex-none   z-20 w-auto bg-slate-400  sm:w-[408px] mt-[120px] mb-10  h-[100%]  shadow-xl  shadow-[#728edb] justify-center items-center bg-gradient-to-r from-cyan-500 to-blue-500 rounded-[40px] p-6  text-white'>
          <div className="text-center">
            <span className="text-white">My Profile</span>
            <div className="mt-6">
              <img
                src={foto_user}
                alt="Your Image Alt Text"
                className=" w-52 h-52   border-2 border-[#E3E8EC]  drop-shadow shadow-md shadow-black rounded-[40px] inline-block" // Adjust the width as needed
              />
            </div>
            <div className='mt-6'>
              <h1 className="text-xl font-bold">{username}</h1>
              <span className="text-sm  font-serif italic flex justify-center mt-3">{email}</span>
            </div>
            <div className="mt-8  flex justify-center flex-col items-center bgs-black mal-6">
              <LevelBar value={String(extractdecimalNumberFromLevel(currentUser.level))} />
              <div className="  flex  justify-center items-center">
                <p className=' mt-4 text-white shadow-sm shadow-black   w-28   uppercasej'>level : {getLevel(currentUser.level)}</p>
              </div>
            </div>
            <div className=" hidden md:flex justify-center items-center  ">

              <div className='mt-6 flex  flex-col items-center'>
                <Link className="text-base font-bold flex justify-center  items-center ml- text-blue-600" href={"/editProfile"}><span className=" py-2 px-28 bg-white border  drop-shadow shadow-md shadow-black  rounded-xl hover:scale-110 duration-300">EditProfile</span>
                </Link>
                <h1 className="flex  mt-[40px] ">Recent Activities</h1>
                <div className={` ${(currentUser.level) < 5 ? `w-80` : 'w-60'} mt-6 h-60   flex items-center justify-center relative`}>
                  <Image fill style={{ objectFit: "cover" }} className='' src={getTheGrad(currentUser.level)} alt='grad'></Image>
                </div>
              </div>
            </div>
            <div className=" md:hidden flex justify-center items-center flex-col ml-3 mt-6 ">

              <Link className="text-base font-bold flex justify-center  items-center ml- text-blue-600" href={"/editProfile"}><span className=" py-2 px-28 bg-white border  drop-shadow shadow-md shadow-black  rounded-xl hover:scale-110 duration-300">EditProfile</span>
              </Link>

              <div className='mt-2 msl-1'>
                {(check != 2) ? (<div>
                  <button onClick={() => freind_ranck1(2)} className=" mt-6 px-[133px]  py-2 text-base font-bold   bg-white  border hover:text-white  drop-shadow shadow-md shadow-black hover:bg-[#3b82f6] rounded-xl  hover:scale-110 duration-300 text-blue-600">Rank</button>
                </div>) : null}
                {(check == 2) ? (<div>
                  <button onClick={() => freind_ranck1(2)} className=" mt-6 px-[135px] py-2 text-base font-bold  border border-white bg-[#3b82f6]  hover:text-white hover:bg-blue-600 drop-shadow shadow-md shadow-black rounded-xl hover:scale-110 duration-300 text-white">Rank</button>
                </div>) : null}
                {(check != 1) ? (<div>
                  <button onClick={() => freind_ranck(1)} className=" mt-8 px-[125px] py-2 text-base font-bold   bg-white border  hover:text-white  hover:bg-[#3b82f6] drop-shadow shadow-md shadow-black rounded-xl hover:scale-110 duration-300 text-blue-600">Friends</button>
                </div>) : null}
                {(check == 1) ? (<div>
                  <button onClick={() => freind_ranck(1)} className=" mt-8 px-[125px] py-2  text-base font-bold  border border-white  bordher-2 borsder-black bg-[#3b82f6] hover:text-blue-600 drop-shadow shadow-md shadow-black rounded-xl hover:bg-black hover:scale-110 duration-300 text-white">Friends</button>
                </div>) : null}

              </div>
            </div>
            <div className="mt-8 flex justify-center ml-3 items-center">
              <button onClick={() => setLogout(1)} className="bg-white  shadow-sm shadow-black  transition-all active:scale-100 rounded-xl border text-blue-600 py-2  px-32 hover:bg:white hovxer:text-white hover:scale-105 duration-300 ">Logout</button>
            </div>
          </div>
        </div>
        <div className=" hidden md:flex">

          <div className=" flex flex-col  dark:bg-slate-800  h-full w-64 items-center   drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] bg-[#f9fafb]  mt-[85px] min-h-[845px]   p-6">
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
              <button onClick={() => freind_ranck(1)} className=" mt-40 px-[100px] py-2  text-base font-bold   bordher-2 borsder-black bg-[#3b82f6] hover:text-blue-600   hover:scale-110 duration-300 text-white">Friends</button>
            </div>) : null}

          </div>

        </div>
        {(<div className=" flex   flex-col justify-center items-center md:opacity-150 bg xl:mt-[80px] sm:mt-6  bg-wshite rounded-md min-h-[845px] dark:bg-slate-500  sm:bg-blue-50  w-[550px] xl:w-[700px] h-16 xl:rounded-2xl xl:rounded-s-[1px] p-2" >
          {
            check === 2 && <Rank amis_id={amis} amis={amis} id={id} />
          }
          {
            check === 1 && <Friends amis_id={amis} amis={amis} currentUser={id} />
          }
        </div>)
        }
      </div>
      {

        logout == 1 && <div className=" absolute flex  justify-center items-center w-full h-full bg-hblack">
          {

            (<div className="flex   items-center    justify-center min-h-screen   min-w-screen  z-20  ">

              <div className=" bg-white md:w-[400px] md:h:72   flex flex-col  justify-strt items-center  sm:w-[400px] sm:h-72  h-72 w-96  drop-shadow shadow-lg shaddow-black  rounded-lg   z-20 text-blue-600 mk-10">
                <div className='text-blue-500 text-xl mt-8  mr-44  font-black' >Confirm logout </div>
                <div className=' w-96 hd-2 border-2 mt-5' > </div>
                <div className='text-blue-500 text-sm mt-8  ml-16  w-full fonts-black' >Are you sure you want to logout ?</div>
                <div className=' w-96 h-16 fbg-black mt-16 flex flex-row justify-center items-center space-x-6 '>
                  <button onClick={() => setLogout(0)} className=' bg-white w-20  border-2 border-blue-600 h-10 rounded-lg'>
                    <div>Cancel</div>
                  </button>
                  <Link href="/auth/login" onClick={handelLogOutUser} className=' bg-blue-500 text-white w-20 flex justify-center items-center  h-10  border-2 border-blue-600 rounded-lg'>
                    OK
                  </Link>

                </div>
              </div>
            </div>)
          }

        </div>
      }
    </div>

  );
};

export default UseProfile;