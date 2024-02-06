
import { useEffect } from 'react';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'
import { Socket } from 'socket.io-client';
import { Constant } from '@/constants/constant';
import { userProps } from '@/interface/data';
export default function Home({currentUser ,socket }: {currentUser : userProps, socket: Socket }) {
  const [foto_user, setfoto_user] = useState("");
  const [username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [win, setWin] = useState(0);
  const [lost, setLost] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    (
      async () => {
        try {

          const response = await fetch(`${Constant.API_URL}/auth/user`, {
            credentials: 'include',
          });
          if (response.ok) {
            const content = await response.json();
            setfoto_user(content.foto_user);
            setEmail(content.email);
            setUsername(content.username);
            setWin(content.won);
            setLost(content.lost)
          }
        } catch (error) {

        }
      }
    )();
  },[]);
  const handelLogOutUser = async () => {
    try {
      const response = await fetch(`${Constant.API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        socket?.emit('Logout')
      }

    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  }

  return (
    // <div class="h-screen bg-gray-400">
    <div className="mx-auto flex justify-end py-1 pr-2">
      <div onClick={toggleDropdown} className="">
        <button className=" flex h-10 w-10 items-center  overflow-hidden rounded-lg bg-slate-700 text-slate-100 ring-slate-100  hover:shadow-md hover:ring-2">
          {/* <img className=" object-cover " src={foto_user} alt="Profile" /> */}
          <div className={'w-full h-full relative'}>

            <Image
              className=''
              src={currentUser.foto_user != '' ? currentUser.foto_user : '/foto_user'}
              alt="user profile"
              fill
              style={{ objectFit: "cover" }}

            />
          </div>
        </button>
        {isOpen && (
          <div className="absolute right-2 mt-2 flex w-60 flex-col gap-3 rounded-xl bg-slate-900 p-4 text-slate-100 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border-2 border-slate-600">
                {/* <img className="w-full object-cover" src={foto_user} alt="Profile" /> */}
                <div className={'w-full h-full relative'}>
                  <Image
                    className=''
                    src={currentUser.foto_user}
                    alt="user profile2"
                    fill
                    style={{ objectFit: "cover" }}

                  />
                </div>
              </div>
              <div>
                <div className="flex gap-1 text-sm font-semibold">
                  <span>{username}</span>
                  <span className="text-sky-400">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"></path>
                    </svg>
                  </span>
                </div>
                <div className="text-xs text-slate-400">{Email}</div>
              </div>
            </div>
            <div className="border-t border-slate-500/30"></div>
            <div className="flex justify-around">
              <div className="flex flex-col items-center justify-center">
                <span className="text-3xl font-semibold">{win}</span>
                <span className="text-sm text-slate-400">Win</span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-3xl font-semibold">{lost}</span>
                <span className="text-sm text-slate-400">Lost</span>
              </div>
            </div>
            <div className="border-t border-slate-500/30"></div>
            <div className="flex flex-col">
              <Link href="/profile" className="flex items-center gap-3 rounded-md py-2 px-3 hover:bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd"></path>
                </svg>
                <span>Profile</span>
              </Link>
              <Link href="/editProfile" className="flex items-center gap-3 rounded-md py-2 px-3 hover:bg-slate-800">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 01-.988-1.129c1.454-1.272 3.776-1.272 5.23 0 1.513 1.324 1.513 3.518 0 4.842a3.75 3.75 0 01-.837.552c-.676.328-1.028.774-1.028 1.152v.75a.75.75 0 01-1.5 0v-.75c0-1.279 1.06-2.107 1.875-2.502.182-.088.351-.199.503-.331.83-.727.83-1.857 0-2.584zM12 18a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd"></path>
                </svg>
                <span>Settings</span>
              </Link>
            </div>
            <Link href="/auth/login" onClick={handelLogOutUser} className="flex justify-center gap-3 rounded-md bg-red-600 py-2 px-3 font-semibold hover:bg-red-500 focus:ring-2 focus:ring-red-400">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd"></path>
              </svg>
              <span>Logout</span>
            </Link>
          </div>)
        }
      </div>
    </div>
    // </div>

  )
};


