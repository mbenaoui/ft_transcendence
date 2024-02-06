import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AppProps } from '@/interface/data'
import { useRouter } from 'next/router'


// export const SideMenuColor: string = '#1ba098'
// export const light: string = '#eee'
// export const primary: string = '#1976D2'
// export const lightPrimary: string = '#CFE8FF'
// export const grey: string = '#eee'
// export const darkGrey: string = '#AAAAAA'
// export const dark: string = '#363949'
// export const danger: string = '#D32F2F'
// export const lightDanger: string = '#FECDD3'
// export const warning: string = '#FBC02D'
// export const lightWarning: string = '#FFF2C6'
// export const success: string = '#388E3C'
// export const lightSuccess: string = '#BBF7D0'



const SideMenu = () => {
    
    const [isDivHidden, setIsDivHidden] = useState(false);
    const [isDivHidden2, setIsDivHidden2] = useState(!true);
    const [activeButton, setActiveButton] = useState<Number>(0);
    const router = useRouter()
    const grey: string = ' bg-[#eee] ';
    const light: string = ' bg-[#f6f6f9] ';
    const handelsplitSidebar = () => {
        const sidebar = document.querySelector('.sidebar')
        if (window.innerWidth < 768) {

            sidebar?.classList.toggle('displaySidebar')
            return
        }
        const navbar = document.querySelector('.navbar')
        const home = document.querySelector('.home')

        sidebar?.classList.toggle('close')
        navbar?.classList.toggle('close')
        home?.classList.toggle('close')
    }
    useEffect(() => {
        window.addEventListener('resize', () => {
            if (window.innerWidth > 780) {
                const sidebar = document.querySelector('.sidebar')
                if (sidebar?.classList.contains('displaySidebar'))
                    sidebar?.classList.toggle('displaySidebar')
            }
        });
    })
    const [friendsComp, setfriendsComp] = useState(false)
    useEffect(() => {
        const lst: Array<string> = ['/', '/chat', '/profile', '/user', '/game', '/search']
        if (lst.indexOf(router.route) != -1)
            setActiveButton(lst.indexOf(router.route) + 1)
        if (router.asPath.includes('users/'))
            setActiveButton(4)

        if (router.asPath == '/game/online?listoffriends=true')
            setfriendsComp(true)
        else
            setfriendsComp(false)
    }, [router])
    return (
        <>
            <div className="bg-CusColor_light w-[60px] z-40 h-[56px]  fixed top-0 left-0"></div>
            <div className="   fixed -top-[30px] z-50 left-[20px]  w-[30px] h-[80px]  mx-auto mt-5  flex justify-start items-center ">
                <button onClick={handelsplitSidebar} className='duration-300 '>
                    <Image src='/menu.png' className='' alt='home' width={20} height={20}></Image>
                </button>
            </div>
            <div className={`text-md sidebar  hidden  md:block  fixed top-0 z-40  pt-20 h-screen  ${light}  space-y-3`}>
                <span id=''  className="z-50 -top-4  right- absolute  duration-300 right-1" >
                    <Image src='/ping-pong-2.png' className={` z-50 xl:block   w-auto`} alt='home' width={65} height={20} priority={true}></Image>
                </span>

                <div className='relative p-2 md:p-0 md:py-2 md:pl-2  w-full bg-red-300s '>
                    <div className={`${activeButton == 1 ? 'block' : 'hidden'} -top-[8px]  right-0 absolute w-[20px] h-[16px]   ${grey}`}>
                        <div className={`w-[20px] h-[16px] ${light}  rounded-none md:rounded-br-[15px]`}>
                        </div>
                    </div>
                    <div className={`${activeButton == 1 ? `${grey}` : light} p-1 rounded-full md:rounded-none md:rounded-l-full transition-padding duration-100 hover:p-2`}>
                        <Link onClick={() => setActiveButton(1)} className={`flex items-center space-x-4 p-2 rounded-full ${light} w-full`} href='/'>

                            <Image src='/icons-home-black.png' className='' alt='home' width={20} height={20}></Image>
                            <span className={`  ${activeButton == 1 ? ' text-blue-900  font-bold' : ''} `}>
                                Home
                            </span>
                        </Link>
                    </div>
                    <div className={`${activeButton == 1 ? 'block' : 'hidden'} -buttom-[8px]  right-0 absolute w-[20px] h-[16px] ${grey}`}>
                        <div className={`w-[20px] h-[16px] ${light} rounded-none md:rounded-tr-[15px]`}></div>
                    </div>
                </div>



                <div className='relative p-2 md:p-0 md:py-2 md:pl-2 w-full bg-red-300s mt-10'>
                    <div className={`${activeButton == 2 ? 'block' : 'hidden'} -top-[8px]  right-0 absolute w-[20px] h-[16px]   ${grey}`}>
                        <div className={`w-[20px] h-[16px] ${light} rounded-none md:rounded-br-[15px]`}>
                        </div>
                    </div>
                    <div className={`${activeButton == 2 ? grey : light} p-1 rounded-full md:rounded-none md:rounded-l-full transition-padding duration-100 hover:p-2`}>
                        <Link onClick={() => setActiveButton(2)} className={`flex items-center space-x-4 p-2 rounded-full ${light} w-full`} href='/chat'>
                            <Image src='/icons-chat-black.png' className='' alt='chat' width={20} height={20}></Image>
                            <span className={` ${activeButton == 2 ? 'text-blue-900  font-bold' : ''} `}>
                                Chat
                            </span>
                        </Link>
                    </div>
                    <div className={`${activeButton == 2 ? 'block' : 'hidden'} -buttom-[8px]  right-0 absolute w-[20px] h-[16px] ${grey}`}>
                        <div className={`w-[20px] h-[16px] ${light} rounded-none md:rounded-tr-[15px]`}></div>
                    </div>
                </div>

                <div className='relative p-2 md:p-0 md:py-2 md:pl-2 w-full bg-red-300s mt-10'>
                    <div className={`${activeButton == 3 ? 'block' : 'hidden'} -top-[8px]  right-0 absolute w-[20px] h-[16px]   ${grey}`}>
                        <div className={`w-[20px] h-[16px] ${light} rounded-none md:rounded-br-[15px]`}>
                        </div>
                    </div>
                    <div className={`${activeButton == 3 ? grey : light} p-1 rounded-full md:rounded-none md:rounded-l-full transition-padding duration-100 hover:p-2`}>
                        <Link onClick={() => setActiveButton(3)} className={`flex items-center space-x-4 p-2 rounded-full ${light} w-full`} href='/profile'>
                            <Image src='/icons-user-black.png' className='' alt='profile' width={20} height={20}></Image>
                            <span className={` ${activeButton == 3 ? 'text-blue-900  font-bold' : ''} `}>
                                Profile
                            </span>
                        </Link>
                    </div>
                    <div className={`${activeButton == 3 ? 'block' : 'hidden'} -buttom-[8px]   right-0 absolute w-[20px] h-[16px] ${grey}`}>
                        <div className={`w-[20px] h-[16px] ${light} rounded-none md:rounded-tr-[15px]`}></div>
                    </div>
                </div>

                <div className='relative p-2 md:p-0 md:py-2 md:pl-2 w-full bg-red-300s mt-10'>
                    <div className={`${activeButton == 4 ? 'block' : 'hidden'} -top-[8px]  right-0 absolute w-[20px] h-[16px]   ${grey}`}>
                        <div className={`w-[20px] h-[16px] ${light} rounded-none md:rounded-br-[15px]`}>
                        </div>
                    </div>
                    <div className={`${activeButton == 4 ? grey : light} p-1 rounded-full md:rounded-none md:rounded-l-full transition-padding duration-100 hover:p-2`}>
                        <Link onClick={() => setActiveButton(4)} className={`flex items-center space-x-4 p-2 rounded-full ${light} w-full`} href='/user'>
                            <Image src='/icons-user-account-black.png' className='' alt='friends' width={20} height={20}></Image>
                            <span className={` ${activeButton == 4 ? 'text-blue-900  font-bold' : ''} `}>
                                Friends
                            </span>
                        </Link>
                    </div>
                    <div className={`${activeButton == 4 ? 'block' : 'hidden'} -buttom-[8px]   right-0 absolute w-[20px] h-[16px] ${grey}`}>
                        <div className={`w-[20px] h-[16px] ${light} rounded-none md:rounded-tr-[15px]`}></div>
                    </div>
                </div>

                <div className='relative p-2 md:p-0 md:py-2 md:pl-2 w-full bg-red-300s mt-10'>
                    <div className={`${activeButton == 5 ? 'block' : 'hidden'} -top-[8px]  right-0 absolute w-[20px] h-[16px]  ${friendsComp ? ' bg-CusColor_grey' : 'bg-[#09247c]'}`}>
                        <div className={`w-[20px] h-[16px] ${light} rounded-none md:rounded-br-[15px]`}>
                        </div>
                    </div>
                    <div className={`${activeButton == 5 ? `${friendsComp ? ' bg-CusColor_grey' : 'bg-[#09247c]'}` : light} p-1 rounded-full md:rounded-none md:rounded-l-full transition-padding duration-100 hover:p-2`}>
                        < Link onClick={() => setActiveButton(5)} className={`flex items-center space-x-4 p-2 rounded-full ${light} w-full`} href='/game'>
                            <Image src='/icons-ping-pong-black.png' className='' alt='prin-pong' width={20} height={20}></Image>
                            <span className={` ${activeButton == 5 ? 'text-blue-900  font-bold' : ''} `}>
                                Play
                            </span>
                        </Link>
                    </div>
                    <div className={`${activeButton == 5 ? 'block' : 'hidden'} -buttom-[8px]  right-0 absolute w-[20px] h-[16px] ${friendsComp ? ' bg-CusColor_grey' : 'bg-[#09247c]'}`}>
                        < div className={`w-[20px] h-[16px] ${light} rounded-none md:rounded-tr-[15px]`}></div>
                    </div>
                </div>

                <div className='relative p-2 md:p-0 md:py-2 md:pl-2 w-full bg-red-300s mt-10'>
                    <div className={`${activeButton == 6 ? 'block' : 'hidden'} -top-[8px]  right-0 absolute w-[20px] h-[16px]   ${grey}`}>
                        <div className={`w-[20px] h-[16px] ${light} rounded-none md:rounded-br-[15px]`}>
                        </div>
                    </div>
                    <div className={`${activeButton == 6 ? grey : light} p-1 rounded-full md:rounded-none md:rounded-l-full transition-padding duration-100 hover:p-2`}>
                        <Link onClick={() => setActiveButton(6)} className={`flex items-center space-x-4 p-2 rounded-full ${light} w-full`} href='/search'>
                            <Image src='/search.png' className='' alt='search' width={20} height={20}></Image>
                            <span className={` ${activeButton == 6 ? 'text-blue-900  font-bold' : ''} `}>
                                Search
                            </span>
                        </Link>
                    </div>
                    <div className={`${activeButton == 6 ? 'block' : 'hidden'} -buttom-[8px]  right-0 absolute w-[20px] h-[16px] ${grey}`}>
                        <div className={`w-[20px] h-[16px] ${light} rounded-none md:rounded-tr-[15px]`}></div>
                    </div>
                </div>
            </div >
        </>

    )
}

export default SideMenu;
