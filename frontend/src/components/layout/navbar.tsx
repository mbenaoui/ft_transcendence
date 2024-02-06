import React, { useEffect, useRef, useState } from 'react'
import { AppProps, userProps } from '@/interface/data'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { handelSendRequest } from '@/handeler/handelbutttons'
import { handelChallenge } from '../game/listOfFriends'
import { Constant } from '@/constants/constant'
import { fetchAllAmis, fetchAllUsers, getAllAmis, getAllUsers } from '@/hooks/userHooks'
import UserInfo from '../user/userInfo'


const Navbar = ({ onlineUsersss, currentUser, socket }: AppProps) => {
    const refCardSearch = useRef<any>();
    const refInput = useRef<any>();
    const [clickInInput, setclickInInput] = useState(false)
    const [click, setclick] = useState(true)
    const [recentSearches, setRecentSearches] = useState<Array<userProps>>([])
    const [query, setQuery] = useState('')
    const [Ssend, setSend] = useState<boolean>(false)
    const router = useRouter()
    const [filterUser, setfilterUser] = useState<Array<userProps>>([])
    const [selectUser, setselectUser] = useState<Number>(-1);
    const [amis, setAmis] = useState<Array<any>>([])
    const [users, setUsers] = useState<Array<any>>([]);
    fetchAllAmis({ setAmis, currentUser })
    fetchAllUsers({ setUsers, currentUser })
    // const [newAmis, _setAmis] = useState<Array<userProps>>(amis)

    const handelOnSubmit = () => {
        const search = query.trim().replace(/\s+/g, ' ')
        if (query.replace(/\s+/g, '')) {
            router.push(`/search?query=${search}`)
        }
    }

    const handelOnKeyDown = (e: any) => {
        if (e.key == 'Enter') {
            const search = query.trim().replace(/\s+/g, ' ')
            if (query.replace(/\s+/g, '')) {
                router.push(`/search?query=${search}`)
                setclick(false)
            }
        }
    }

    const handelClickInInput = async () => {
        setclickInInput((pr) => !pr)
        setclick(true)
        const data = await getAllAmis({ currentUser })
        const data1 = await getAllUsers({ currentUser })
        setAmis(Array.from(data))
        setUsers(Array.from(data1))
        try {
            const respons = await fetch(`${Constant.API_URL}/search/recent`, {
                credentials: 'include'
            })
            const content = await respons.json()
            setRecentSearches(Array.from(content))
        } catch (error) {

        }
    }
    useEffect(() => {
        document.addEventListener('click', (event: any) => {
            if (refCardSearch.current && !refCardSearch.current.contains(event.target) && !refInput.current.contains(event.target)) {
                setclickInInput(false)
                setclick(false)
            }
        })
    }, [])
    useEffect(() => {
        if (query.replace(/\s+/g, '')) {
            const usrs = users.filter((user: userProps) => {
                user.flag = true
                amis.filter((usr: userProps) => {
                    if (usr.id == user.id) {
                        user.flag = false
                    }
                })
                return user.username?.toLowerCase().includes(query.trimStart().trimEnd().replace(/\s+/g, ' ').toLowerCase())
            }
            )
            setfilterUser(usrs)
        }
        if (query == '') {
            const usrs = recentSearches.filter((user: userProps) => {
                user.flag = true
                amis.filter((usr: userProps) => {
                    if (usr.id == user.id) {
                        user.flag = false
                    }
                })
                return user.username?.toLowerCase().includes(query.trimStart().trimEnd().replace(/\s+/g, ' ').toLowerCase())
            }
            )
            setfilterUser(usrs)
        }
    }, [query, users, amis, recentSearches])

    const handelClickProfile = async (id: Number) => {
        try {
            const response = await fetch(`${Constant.API_URL}/search/recent`, {
                method: "POST",
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    adduserTorecent: id
                }),
            })
        } catch (error) {
        }
    }
    const handelClearOneFromSearch = async (id: Number) => {
        try {
            const response = await fetch(`${Constant.API_URL}/search/recent/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const respons = await fetch(`${Constant.API_URL}/search/recent`,
                {
                    credentials: 'include'
                })
            const content = await respons.json()
            setRecentSearches(Array.from(content))

        } catch (error) {
        }
    }

    useEffect(() => {
        document.addEventListener('click', (event: any) => {
            const clickedElement = event.target;
            if (clickedElement.classList.contains('hidediv')) {
                setclickInInput(false)
                setclick(false)
            }
        });
    }, []);
    const [arrayOfsender, setarrayOfsender] = useState<Array<Number>>([])
    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`${Constant.API_URL}/friends/send-requests`, {
                        credentials: 'include',
                    });
                    const content = await response.json();
                    if (response.status == 200) {
                        const arrayy: Array<Number> = []
                        Array.from(content).map((item: any) => {
                            arrayy.push(item.receiver.id)
                        })
                        setSend((pr) => pr)
                        setarrayOfsender(arrayy)
                        return;
                    }
                } catch (error) {

                }
            }
        )();
    }, [currentUser, query, Ssend,]);
    const handelButtonSearch = () => {
        const search = document.querySelector('.Search')
        search?.classList.toggle('display')
        const submetButton = document.querySelector('.submetButton')
        submetButton?.classList.toggle('display')
    }
    return (
        <>
            <div className={`navbar fixed top-0 z-40  bg-CusColor_light flex justify-between items-center py-1 pl-10`}>
                <div className=" left-6 w-full sm:w-[45%] xl:w-[35%] max-w-[500px]">
                    <div className="relative ">
                        <button title='iconssearch' onClick={handelButtonSearch} className="absolute  z-50 inset-y-0 -left-8  md:left-0 flex items-center pl-3 md:pointer-events-none">
                            <svg className=" w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                            </svg>
                        </button>
                        <input onClick={handelClickInInput} value={query} ref={refInput} onChange={(e) => { setQuery(e.target.value); setclick(true) }} autoComplete='off' onKeyDown={handelOnKeyDown}
                            className="Search  bg-slate-40  right-0 border-0  sm:border  sm:focus:ring-1 focus:ring-black focus:ring-offset-2
                            outline-none block   text-sm  text-gray-900  border-gray-200 rounded-lg bg-gray-50     duration-300
                         dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white" placeholder="Search" required />
                        <div className=" bg-slate-400 submetButton">
                            <button type="submit" onClick={handelOnSubmit}
                                className="text-white absolute rounded-lg text-[12px]  md:text-sm px-2 md:px-3 inset-y-[4px] py-[6px] md:py-[5.5px] right-[3.6px]  bg-blue-600 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium  dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                Search
                            </button>
                            <button onClick={() => setQuery('')} className="text-white absolute right-[58px] md:right-[75px] bottom-[8px] hover:bg-blue-100   rounded-sm duration-300 ">
                                <Image src={'/clean.png'} width={20} height={20} alt="clean"></Image>
                            </button>
                        </div>
                        {
                            (query != '' || clickInInput) && click && router.route != '/search' ? (

                                <div ref={refCardSearch} className="hideScroll hidden md:block overflow-auto  scroll-m-5 absolute  top-12 bg-CusColor_grey shadow-2xl  w-[400px] h-[400px]  rounded-xl  transition-transform px-4">
                                    <div className="text-sm font-bold flex justify-between p-2  text-slate-600">
                                        {
                                            query == '' ?
                                                (<h3>Recent</h3>) : (
                                                    <h3>All users ({filterUser.length}) </h3>
                                                )
                                        }
                                        <Link href={query == '' ? `/search` : `/search?query=${query}`} className='hidediv text-blue-700'>See all </Link>

                                    </div>
                                    {
                                        filterUser.map((user: userProps) => (
                                            <div key={user.username + String(user.id)} className='flex items-center' >
                                                <button className={'z-10 absolute left-5 w-[18px] h-[18px] opacity-60   flex justify-center items-center'}>
                                                    <Image
                                                        className=' bg-CusColor_grey  absolute opacity-100 hover:opacity-0'
                                                        src={query == '' ? '/clean.png' : '/search.png'}
                                                        alt="user profile"
                                                        width={200}
                                                        height={200}

                                                    />
                                                    <Image
                                                        className=' bg-CusColor_grey  absolute opacity-100 hover:opacity-0'
                                                        src={query == '' ? '/recent.png' : '/search.png'}
                                                        alt="user profile"
                                                        width={200}
                                                        height={200}
                                                        onClick={() => handelClearOneFromSearch(user.id)}

                                                    />
                                                </button>
                                                <div className={`flex w-[100%] justify-between hover:bg-slate-200 p-2 rounded-xl  `}

                                                    onClick={() => handelClickProfile(user.id)}
                                                >
                                                    <div className="flex justify-center space-x-3">
                                                        <div className="w-[10px] h-[20px]"></div>
                                                        <div className=" relative">
                                                            <div className={`absolute z-40 right-0 w-[11px] h-[11px]  bg-white rounded-full flex justify-center items-center ${(!user.flag) ? ' ' : ' hidden '}`}>
                                                                <div className={` w-[8px] h-[8px]  rounded-full ${onlineUsersss.includes(user.id) ? 'bg-green-500' : 'bg-red-500'}`} />
                                                            </div>

                                                            <div className={'w-[40px] h-[40px] relative '}>
                                                                <Image
                                                                    className='rounded-xl'
                                                                    src={user.foto_user}
                                                                    alt="user profile"
                                                                    fill
                                                                    sizes="()"
                                                                    style={{ objectFit: "cover" }}

                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="">
                                                            <Link
                                                                href={`/users/${user.username}.${user.id}`}
                                                                className="hidediv hover:border-b border-blue-500  font-semibold">
                                                                {user.username}
                                                            </Link>

                                                            <div className={`text-[12px] text-slate-500 ${user.flag ? ' hidden ' : ' block '}`}>
                                                                friend
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className=" flex  space-x-6 items-center ">
                                                        {

                                                            user.flag ? (
                                                                arrayOfsender.includes(user.id) ? (
                                                                    <div className=' border-2  border-blac  p-2 rounded-md hover:ring-offset-2 hover:ring-2 duration-300 hover:ring-red-200'>
                                                                        <Image src='/friend-request.png' className=' fill-red-700  text-red-200' alt='search' width={24} height={24} />
                                                                    </div>
                                                                ) : (
                                                                    <button onClick={() => handelSendRequest({ id: currentUser.id, friendId: user.id, setSend: setSend })} className=' border-2  border-blac  p-2 rounded-md hover:ring-offset-2 hover:ring-2 duration-300 hover:ring-red-200'>
                                                                        <Image src='/add-friend.svg' className=' fill-red-700  text-red-200' alt='search' width={20} height={20} />
                                                                    </button>

                                                                )
                                                            ) : (
                                                                <div
                                                                    className='relative ' hidden={router.pathname.startsWith('/game') && router.asPath != '/game' && router.asPath != '/game/online?listoffriends=true'}>
                                                                    <button onClick={() => onlineUsersss.includes(user.id) ? handelChallenge({ oppId: user.id, socket: socket, currentUser: currentUser, selectUser: selectUser, setselectUser: setselectUser, router: router, setclick: setclick }) : undefined}
                                                                        className=' border-2  border-blac  p-2 rounded-md hover:ring-offset-2 hover:ring-2 duration-300 hover:ring-red-200 relative'>

                                                                        <Image src='/icons-ping-pong-black.png' className=' ' alt='search' width={20} height={20}></Image>
                                                                    </button>
                                                                    <div className={` absolute top-0 right-[0px] bg-white text-blue-800  w-[200px] h-[150px] flex flex-col justify-between items-center  z-50 rounded-2xl p-4 shadow-xl ${!(user.id === selectUser) ? 'hidden' : ""}`}>
                                                                        <div className="w-full flex justify-end">
                                                                            <button onClick={() => setselectUser(-1)}>
                                                                                <Image width={30} height={30} src={'/clean.png'} alt='x' />
                                                                            </button>
                                                                        </div>
                                                                        <div className="text-center w-full text-xl relative -top-6">
                                                                            This Player is not Available new.
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }

                                                        <button onClick={() => router.push(`/chat?user=${user.id}`)} className=' bg-blue-300 p-2 rounded-md  hover:ring-offset-2 hover:ring-2 duration-300'>
                                                            <Image src='/icons-chat-black.png' className='' alt='search' width={20} height={20}></Image>
                                                        </button>
                                                    </div>
                                                </div>

                                            </div>
                                        ))
                                    }
                                </div>
                            ) : null
                        }
                    </div>
                </div>
                <div className="flex w-[55%] sm:w-[20%] relative justify-around items-center">
                    {/* 
                    <=== Dark Mode ===>
                    <div className="">
                        <button className=' block dark:hidden  rounded-md' onClick={toggleTheme}>
                            <Image src='/night-mode.png' className='' alt='home' width={27} height={27}></Image>

                        </button>
                        <button className='hidden dark:block  rounded-md' onClick={toggleTheme}>
                            <Image src='/sun.png' className='' alt='home' width={27} height={27}></Image>

                        </button>
                    </div> */}
                    {/* <button className=" relative ">
                        <Image src='/notification-2.png' className='' alt='home' width={27} height={27}></Image>
                        <div className=" border-2 border-CusColor_light w-5 h-5 bg-CusColor_danger  absolute -top-[3px] -right-1 rounded-full flex justify-center items-center">
                            <h4 className="text-[13px]  text-white ">
                                +9
                            </h4>
                        </div>
                    </button> */}
                    <div className="flex items-center space-x-3 text-xl capitalize">
                        <div>{currentUser.username}</div>
                        <UserInfo currentUser={currentUser} socket={socket} />
                    </div>
                </div>
            </div >
        </>
    )
}
export default Navbar
