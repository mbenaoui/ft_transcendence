import React, { useEffect, useState } from 'react'
import { AppProps, userProps, listConversationDirect, userData } from '@/interface/data';
import { Constant } from '@/constants/constant';
import { useRouter } from 'next/router';

const DirectConversationList = ({ currentUser, msg2, users, amis, setStatus_Tow_User, status_tow_user }: { currentUser: userProps, msg2: string, users: userProps[], amis: userProps[], setStatus_Tow_User: (value: boolean) => void, status_tow_user: boolean }) => {

    const [click, setClick] = useState(false)
    const [liststatus, setliststatus] = useState<number[]>([]);
    const [last_amis, setLastAmis] = useState<Array<userProps>>([])
    const [conversationList, setConversationList] = useState<Array<listConversationDirect>>([])
    const [receiver, setReceiver] = useState<userProps>(userData)
    const router = useRouter()

    useEffect(() => {
        let id = Number(router.query.user)
        users.map((item) => {
            if (item.id == id) {
                setReceiver(item)
            }
        })
    }, [router])

    useEffect(() => {
        (
            async () => {
                try {

                    const response = await fetch(`${Constant.API_URL}/friends/accepted-friends/${currentUser.id}`, {
                        credentials: 'include',
                    });
                    const content = await response.json();
                    if (response.ok)
                        setLastAmis(content);

                } catch (error) {
                }
            }
        )();
    }, [currentUser]);


    
    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`${Constant.API_URL}/chat/getConversationListDirect/direct`, {
                        credentials: 'include',
                    });
                    if (response.ok) {
                        const content = await response.json();

                        setConversationList(Array.from(content))
                    }
                } catch (error) {

                }
            }
        )();
    }, [click, msg2, receiver]);
    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`${Constant.API_URL}/chat/listUserBlockedInChat`, {
                        credentials: 'include',
                    });
                    if (response.ok) {
                        const content = await response.json();
                        setliststatus((content))
                    }
                } catch (error) {

                }
            }
        )();
    }, [status_tow_user]);
    useEffect(() => {

        let filterstustamis: any = last_amis.filter((user: userProps) => {
            user.flag = true;
            liststatus.filter((usr: any) => {
                if (usr == user.id) {
                    user.flag = false
                }
            })
            return user
        });
        setLastAmis(filterstustamis)
    }, [click, liststatus])
    useEffect(() => {

        const filterUser1: Array<listConversationDirect> = conversationList.filter((user: listConversationDirect) => {
            user.flag = false;
            liststatus.filter((usr: any) => {
                if (usr == user.id) {
                    user.flag = true
                }
            })
            return user
        })
        if (filterUser1)
            setConversationList(filterUser1);
    }, [click, liststatus])

    return (
        <div className=' w-full h-full flex justify-start items-center flex-col'>
            {
                !click ? (
                    <button onClick={() => setClick(true)} className=" -mt-4 text-white  bg-sky-400 rounded-full justify-center w-[90%] h-10 items-center  duration-300 hover:scale-105">
                        <div className=" justify-center items-center flex space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none">
                                <path d="M8.46002 8.28978C8.27172 8.09617 8.01422 7.98529 7.74416 7.98154C7.47411 7.97779 7.21363 8.08147 7.02002 8.26978C6.82641 8.45808 6.71554 8.71558 6.71179 8.98564C6.70804 9.25569 6.81172 9.51617 7.00002 9.70978L9.34002 11.9998L7.00002 14.2898C6.90629 14.3827 6.8319 14.4933 6.78113 14.6152C6.73036 14.7371 6.70422 14.8678 6.70422 14.9998C6.70422 15.1318 6.73036 15.2625 6.78113 15.3844C6.8319 15.5062 6.90629 15.6168 7.00002 15.7098C7.09298 15.8035 7.20359 15.8779 7.32545 15.9287C7.4473 15.9794 7.57801 16.0056 7.71002 16.0056C7.84203 16.0056 7.97274 15.9794 8.0946 15.9287C8.21646 15.8779 8.32706 15.8035 8.42002 15.7098L11.42 12.7098C11.5138 12.6168 11.5881 12.5062 11.6389 12.3844C11.6897 12.2625 11.7158 12.1318 11.7158 11.9998C11.7158 11.8678 11.6897 11.7371 11.6389 11.6152C11.5881 11.4933 11.5138 11.3827 11.42 11.2898L8.46002 8.28978ZM16.96 11.2898L13.96 8.28978C13.7717 8.10147 13.5163 7.99569 13.25 7.99569C12.9837 7.99569 12.7283 8.10147 12.54 8.28978C12.3517 8.47808 12.2459 8.73348 12.2459 8.99978C12.2459 9.26608 12.3517 9.52147 12.54 9.70978L14.84 11.9998L12.54 14.2898C12.4463 14.3827 12.3719 14.4933 12.3211 14.6152C12.2704 14.7371 12.2442 14.8678 12.2442 14.9998C12.2442 15.1318 12.2704 15.2625 12.3211 15.3844C12.3719 15.5062 12.4463 15.6168 12.54 15.7098C12.633 15.8035 12.7436 15.8779 12.8654 15.9287C12.9873 15.9794 13.118 16.0056 13.25 16.0056C13.382 16.0056 13.5127 15.9794 13.6346 15.9287C13.7565 15.8779 13.8671 15.8035 13.96 15.7098L16.96 12.7098C17.0564 12.6195 17.134 12.511 17.1882 12.3906C17.2424 12.2701 17.2723 12.1401 17.276 12.0081C17.2797 11.8761 17.2572 11.7446 17.2099 11.6213C17.1625 11.498 17.0912 11.3854 17 11.2898H16.96Z" fill="white" />
                            </svg>
                            <h1 className="hidden md:block">Start New Conversation</h1>

                        </div>
                    </button>
                ) : null
            }

            <div className='overflow-y-scroll scrollbar-hide bg-fblack bg-blfue-500 h-[600px] w-full'>
                {
                    click ? (
                        <div className=" bg-slatfe-400 fbg-sky-300  w-full h-full flex  flex-col ">
                            <button onClick={() => setClick(false)} className="rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 20 20" fill="none">
                                    <path d="M6.29 9.29C6.19896 9.3851 6.12759 9.49725 6.08 9.62C5.97998 9.86346 5.97998 10.1365 6.08 10.38C6.12759 10.5028 6.19896 10.6149 6.29 10.71L9.29 13.71C9.4783 13.8983 9.7337 14.0041 10 14.0041C10.2663 14.0041 10.5217 13.8983 10.71 13.71C10.8983 13.5217 11.0041 13.2663 11.0041 13C11.0041 12.7337 10.8983 12.4783 10.71 12.29L9.41 11H13C13.2652 11 13.5196 10.8946 13.7071 10.7071C13.8946 10.5196 14 10.2652 14 10C14 9.73478 13.8946 9.48043 13.7071 9.29289C13.5196 9.10536 13.2652 9 13 9H9.41L10.71 7.71C10.8037 7.61704 10.8781 7.50644 10.9289 7.38458C10.9797 7.26272 11.0058 7.13201 11.0058 7C11.0058 6.86799 10.9797 6.73728 10.9289 6.61542C10.8781 6.49356 10.8037 6.38296 10.71 6.29C10.617 6.19627 10.5064 6.12188 10.3846 6.07111C10.2627 6.02034 10.132 5.9942 10 5.9942C9.86799 5.9942 9.73728 6.02034 9.61542 6.07111C9.49356 6.12188 9.38296 6.19627 9.29 6.29L6.29 9.29ZM0 10C0 11.9778 0.58649 13.9112 1.6853 15.5557C2.78412 17.2002 4.3459 18.4819 6.17317 19.2388C8.00043 19.9957 10.0111 20.1937 11.9509 19.8079C13.8907 19.422 15.6725 18.4696 17.0711 17.0711C18.4696 15.6725 19.422 13.8907 19.8079 11.9509C20.1937 10.0111 19.9957 8.00043 19.2388 6.17317C18.4819 4.3459 17.2002 2.78412 15.5557 1.6853C13.9112 0.58649 11.9778 0 10 0C8.68678 0 7.38642 0.258658 6.17317 0.761205C4.95991 1.26375 3.85752 2.00035 2.92893 2.92893C1.05357 4.8043 0 7.34784 0 10ZM18 10C18 11.5823 17.5308 13.129 16.6518 14.4446C15.7727 15.7602 14.5233 16.7855 13.0615 17.391C11.5997 17.9965 9.99113 18.155 8.43928 17.8463C6.88743 17.5376 5.46197 16.7757 4.34315 15.6569C3.22433 14.538 2.4624 13.1126 2.15372 11.5607C1.84504 10.0089 2.00346 8.40034 2.60896 6.93853C3.21447 5.47672 4.23984 4.22729 5.55544 3.34824C6.87103 2.46919 8.41775 2 10 2C12.1217 2 14.1566 2.84285 15.6569 4.34315C17.1571 5.84344 18 7.87827 18 10Z" fill="#3AB8FF" />
                                </svg></button>
                            <h1 className=' ml-10 w-full hidden md:block text-xl '>Friends list</h1>

                            {
                                (last_amis.length != 0) ? last_amis?.map((item: userProps, index) => (
                                    <button key={index} onClick={() => { router.replace(`/chat?user=${item.id}`) }} className={`h-20 mt-3 w-full md:p-2 ${item.id == receiver.id ? 'md:bg-blue-200 ' : 'md:bg-white  md:hover:bg-blue-200 '}  justify-between items-center inline-flex    ${receiver.id ? 'md:border-2' : 'border-2'}  border-sky-400   rounded-xl`}>
                                        <div className="h-auto  justify-start items-center gap-2.5 flex">
                                            <img className={`w-20 h-20  border-2 md:border-white  sm:h-20   sm:w-20  ${item.id == receiver.id ? ' md:border-0 border-4 border-sky-500  ' : ' md:border-0 border-4 border-white '} shadow-md shadodw-black md:w-16 md:h-16 rounded-full`} src={item.foto_user} />
                                            <div className="   flex flex-col justify-center items-start space-y-1 ">
                                                <h4 className={` ${receiver.id ? 'hidden' : null}   md:flex  md:text-xl md:font-mono md:font-bofld`} >{item.username}</h4>
                                            </div>
                                        </div>
                                    </button>
                                )) : <div className='mt-10 w-full justify-center  flex'>Your friends list is empty</div>
                            }
                        </div>
                    ) : (

                        <div className="  flex  flex-col items-center justify-center">
                            {(conversationList.length != 0) ? conversationList.map((item: listConversationDirect, index) => (
                                <button key={index} onClick={() => { router.replace(`/chat?user=${item.id}`) }} className={`h-20 mt-3 w-full md:p-2 ${item.id == receiver.id ? 'md:bg-blue-200  ' : 'md:bg-white  md:hover:bg-blue-200 '}  justify-between items-center inline-flex   ${receiver.id ? 'md:border-2 border-sky-400 ' : 'border-2 border-sky-400 '}   rounded-xl`}>
                                    <div className={`h-auto  w-full bg-blsack ${receiver.id ? 'justify-center' : null}  space-x-2 md:justify-start items-center gasp-2.5 flex`}>
                                        <img className={`w-20 h-20  border-2 md:border-white  sm:h-20   sm:w-20  ${item.id == receiver.id ? ' md:border-0 border-4 border-sky-500  ' : ' md:border-0 border-4 border-white '} shadow-md shadodw-black md:w-16 md:h-16 rounded-full`} src={item.foto_user} />
                                        <div className="   flex flex-col justify-center items-start space-y-1 ">
                                            <h4 className={` ${receiver.id ? 'hidden md:block' : null}   md:flex  md:text-xl md:font-mono md:font-bolfd`} >{item.username}</h4>
                                        </div>
                                    </div>
                                </button>
                            )) : null
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}
export default DirectConversationList