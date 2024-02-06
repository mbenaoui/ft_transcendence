import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import { AppProps, userProps } from '@/interface/data'
import Link from 'next/link'
import { handelSendRequest } from '@/handeler/handelbutttons'
import { getLevel, handelChallenge } from '@/components/game/listOfFriends'
import { Constant } from '@/constants/constant'
const index = ({ onlineUsersss, currentUser, users, amis, socket }: AppProps) => {
    const router = useRouter()
    const [filterUser, setfilterUser] = useState<Array<userProps>>([])
    const [currentPath, setcurrentPath] = useState<string>('')
    const [recentSearches, setRecentSearches] = useState<Array<userProps>>([])
    const [arrayOfsender, setarrayOfsender] = useState<Array<Number>>([])
    const [Ssend, setSend] = useState<boolean>(false)
    const [selectUser, setselectUser] = useState<Number>(-1);

    const qr: string | string[] | undefined = router.query.query
    let query: string = "";


    if (typeof qr === 'string') {
        query = qr
    } else if (Array.isArray(qr)) {
        qr.map((value: string) => { query += String(value) })
    }

    const handelGetBack = () => {
        router.push('/')

    }

    useEffect(() => {
        (
            async () => {
                try {
                    const respons = await fetch(`${Constant.API_URL}/search/recent`, {
                        credentials: 'include',
                    })
                    const content = await respons.json()
                    setRecentSearches(Array.from(content))
                } catch (error) {

                }
            }
        )();
    }, [currentUser])
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
        if (router.asPath == '/search') {
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
    }, [query, users, amis, recentSearches, router])
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
    }, [currentUser, query, Ssend]);


    useEffect(() => {
        setcurrentPath(router.asPath)
    }, [router])
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
    const handelClearSearch = async () => {
        try {
            const response = await fetch(`${Constant.API_URL}/search/recent`, {
                method: 'DELETE',
                credentials: 'include',
            });
            if (response.ok)
                setRecentSearches([])
        } catch (error) {

        }
    }
    const handelClearOneFromSearch = async (id: Number) => {
        try {
            const response = await fetch(`${Constant.API_URL}/search/recent/${currentUser.id}/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const respons = await fetch(`${Constant.API_URL}/search/recent`)
            const content = await respons.json()
            if (respons.ok && respons.ok)
                setRecentSearches(Array.from(content))

        } catch (error) {
        }
    }

    return (
        <>
            <menu>
                <div className='w-full flex justify-center mt-14'>
                    <div className='w-[100%] flex justify-between border-b-[1px] border-black border-opacity-10 sm:mx-10 md:mx-20   xl:mx-32 p-2 mb-4'>
                        <div className="py-2">
                            {currentPath == '/search' ? 'Recent' : 'All results'}
                        </div>
                        <button onClick={handelClearSearch} hidden={currentPath != '/search'} className='w-[120px] border-2 border-slate-300 py-2  rounded-md  font-bold hover:bg-slate-300 duration-300 '>
                            Clear search
                        </button>
                    </div>
                </div>

                <div className=" hidden  sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5  place-items-center  sm:mx-10 md:mx-20  xl:mx-32 ">
                    {
                        filterUser.map((user: userProps) => (
                            <div key={user.id} className="w-[100%] h-[220px] max-w-[180px] bg-white m-2 p-2 rounded-xl flex flex-col items-start shadow-md space-y-1">
                                <Link className='w-full flex justify-between hover:bg-slate-200  rounded-xl '
                                    href={`/users/${user.username}.${user.id}`}
                                >
                                    <div onClick={() => handelClickProfile(user.id)} className={'w-[100%] h-[120px] relative '}>
                                        <Image
                                            className=' rounded-xl'
                                            src={user.foto_user}
                                            alt="user profile"
                                            sizes='()'
                                            fill
                                            style={{ objectFit: "cover" }}
                                        />

                                    </div>
                                </Link>
                                <div className="w-full">
                                    {user.username}
                                    <div className="text-sm text-slate-500 flex items-center justify-between w-full">
                                        {!user.flag ? (
                                            <div className=" flex items-center space-x-2">
                                                <h1>
                                                    {onlineUsersss.includes(user.id) ? 'online' : 'offline'}
                                                </h1>
                                                <div className={`w-2 h-2 rounded-full ${onlineUsersss.includes(user.id) ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                            </div>
                                        ) : null}
                                        <div className="">
                                            LEVEL {getLevel(user.level)}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between text-[11px] font-bol w-full ">
                                    {user.flag ? (
                                        !arrayOfsender.includes(user.id) ? (<div className=" relative w-[50%] flex bg-slate-800 hover:bg-slate-600 text-white p-2 rounded-lg  justify-center items-center ">
                                            <Image className=' absolute   left-[2px]' width={20} height={20} src={'/add-user.png'} alt='addfriend'></Image>
                                            <button onClick={() => handelSendRequest({ id: currentUser.id, friendId: user.id, setSend: setSend })} className=' absolute right-[2px]' > Add friend</button>
                                        </div>) :
                                            (<div className=" relative w-[50%] flex bg-slate-800 hover:bg-slate-600 text-white p-2 rounded-lg  justify-center items-center ">
                                                <button className=' absolute right-[2px]' > Cancel request</button>
                                            </div>)
                                    ) : (
                                        <div className="w-[45%] flex bg-slate-800 hover:bg-slate-600 text-white p-1 rounded-lg  justify-center items-center ">
                                            <Image className=' ' width={20} height={20} src={'/icons-ping-pong-white.png'} alt='addfriend'></Image>
                                            <button onClick={() => onlineUsersss.includes(user.id) ? handelChallenge({ oppId: user.id, socket: socket, currentUser: currentUser, selectUser: selectUser, setselectUser: setselectUser, router: router }) : undefined}
                                                className='pl-2' >  Play</button>
                                        </div>
                                    )}
                                    <div className="w-[45%] flex bg-[#eee] hover:bg-[#d6d5d5] text-black  p-1 rounded-lg justify-center items-center ">
                                        <Image className=' ' width={20} height={20} src={'/messenger.png'} alt='messenger'></Image>
                                        <button onClick={() => router.push(`/chat?user=${user.id}`)} className=''>Message</button>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className="block sm:hidden mx-2">
                    {
                        filterUser.map((user: userProps) => (
                            <div key={user.id} className='flex items-center' >
                                <button className={'z-10 absolute left-3 w-[18px] h-[18px] opacity-60   flex justify-center items-center'}>
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
                                                    className=' rounded-xl'
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
                                            ) : (<button onClick={() => onlineUsersss.includes(user.id) ? handelChallenge({ oppId: user.id, socket: socket, currentUser: currentUser, selectUser: selectUser, setselectUser: setselectUser, router: router }) : undefined} className=' border-2  border-blac  p-2 rounded-md hover:ring-offset-2 hover:ring-2 duration-300 hover:ring-red-200'>
                                                <Image src='/icons-ping-pong-black.png' className=' ' alt='search' width={20} height={20}></Image>
                                            </button>)
                                        }
                                        <button onClick={() => router.push(`/chat?user=${user.id}`)} className=' bg-blue-300 p-2 rounded-md  hover:ring-offset-2 hover:ring-2 duration-300'>
                                            <Image src='/icons-chat-black.png' className='' alt='search' width={20} height={20}></Image>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>

            </menu>
            <div className={`${filterUser.length == 0 ? ' flex ' : ' hidden '} w-full 300   justify-center `}>
                <footer className='w-[60%] min-w-[400px] max-w-[760px]  shadow-xl rounded-2xl mt-20 py-10 flex flex-col justify-center items-center space-y-3'>
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
                        <h2 className={`${currentPath == '/search' ? 'hidden' : 'block'}`}>with the name "{query}" .Please try again.</h2>
                    </div>
                    <div className="space-x-3">
                        <button onClick={handelClearSearch} className='w-[120px] border-2 border-slate-300 py-2  rounded-md  font-bold hover:bg-slate-300 duration-300 '>Clear search</button>
                        <button onClick={handelGetBack} className='w-[120px] border-2  bg-blue-300 py-2  text-blue-800 rounded-md  font-bold hover:bg-blue-400 duration-300'>Get back</button>
                    </div>
                </footer>
            </div>
        </>
    )
}

export default index


