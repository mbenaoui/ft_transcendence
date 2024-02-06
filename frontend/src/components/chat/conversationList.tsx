import React, { useEffect, useState } from 'react'
import DirectConversationList from './direct/directConversationList'
import ChannelsList from './channels/channelsList'
import { AppProps, channelProps, userData, userProps } from '@/interface/data';
import { useRouter } from 'next/router';


const ConversationList = ({ currentUser, msg2, amis, setButton, users, setRoom, setjoinchannel, setStatus_Tow_User, status_tow_user, Room, setJoinRoom }: { currentUser: userProps, msg2: string, amis: userProps[], setButton: (value: boolean) => void, users: userProps[], setRoom: (value: channelProps) => void, setjoinchannel: (value: boolean) => void, setStatus_Tow_User: (value: boolean) => void, status_tow_user: boolean, Room: channelProps, setJoinRoom: (value: channelProps) => void, }) => {

    const [click, setClick] = useState(true)
    const [receiver, setReceiver] = useState<userProps>(userData)
    let router = useRouter()

    useEffect(() => {
        let id = Number(router.query.user)
        users.map((item) => {
            if (id == item.id) {
                setClick(true);
                setButton(false)
                setReceiver(item)
            }
        })
    }, [router])


    return (
        <div className={` bg-white p-4  ml-2  mt-12  overflow-hidden ; ${(Room.id != 0 || receiver.id != 0) ? 'sm:ml-7 w-[130px]  md:w-[300px] lg:w-[350px]' : 'w-[350px]'}  ;   h-[820px]    flex-col justify-start items-start gap-5 inline-flex border-2  border-sky-400 rounded-xl`}>

            <div className=" bg-bdlack self-stretch  h-20 flex -mt-4  justify-center items-center gap-3">
                <button onClick={() => { setClick(true); setButton(false) }} className={` w-40 h-10 ${click ? ' bg-sky-400 text-white' : 'bg-white text-sky-400'} rounded-full justify-center items-center inline-flex  border-2  border-sky-400 `}>
                    <div className="justify-start items-center gap-2 flex">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M8.00011 11C7.80233 11 7.60899 11.0586 7.44454 11.1685C7.28009 11.2784 7.15192 11.4346 7.07623 11.6173C7.00054 11.8 6.98074 12.0011 7.01932 12.1951C7.05791 12.3891 7.15315 12.5673 7.293 12.7071C7.43286 12.847 7.61104 12.9422 7.80502 12.9808C7.999 13.0194 8.20007 12.9996 8.38279 12.9239C8.56552 12.8482 8.7217 12.72 8.83158 12.5556C8.94146 12.3911 9.00011 12.1978 9.00011 12C9.00011 11.7348 8.89475 11.4804 8.70722 11.2929C8.51968 11.1054 8.26533 11 8.00011 11ZM12.0001 11C11.8023 11 11.609 11.0586 11.4445 11.1685C11.2801 11.2784 11.1519 11.4346 11.0762 11.6173C11.0005 11.8 10.9807 12.0011 11.0193 12.1951C11.0579 12.3891 11.1532 12.5673 11.293 12.7071C11.4329 12.847 11.611 12.9422 11.805 12.9808C11.999 13.0194 12.2001 12.9996 12.3828 12.9239C12.5655 12.8482 12.7217 12.72 12.8316 12.5556C12.9415 12.3911 13.0001 12.1978 13.0001 12C13.0001 11.7348 12.8948 11.4804 12.7072 11.2929C12.5197 11.1054 12.2653 11 12.0001 11ZM16.0001 11C15.8023 11 15.609 11.0586 15.4445 11.1685C15.2801 11.2784 15.1519 11.4346 15.0762 11.6173C15.0005 11.8 14.9807 12.0011 15.0193 12.1951C15.0579 12.3891 15.1532 12.5673 15.293 12.7071C15.4329 12.847 15.611 12.9422 15.805 12.9808C15.999 13.0194 16.2001 12.9996 16.3828 12.9239C16.5655 12.8482 16.7217 12.72 16.8316 12.5556C16.9415 12.3911 17.0001 12.1978 17.0001 12C17.0001 11.7348 16.8948 11.4804 16.7072 11.2929C16.5197 11.1054 16.2653 11 16.0001 11ZM12.0001 2C10.6869 2 9.38653 2.25866 8.17328 2.7612C6.96002 3.26375 5.85763 4.00035 4.92904 4.92893C3.05368 6.8043 2.00011 9.34784 2.00011 12C1.99137 14.3091 2.7909 16.5485 4.26011 18.33L2.26011 20.33C2.12135 20.4706 2.02736 20.6492 1.98998 20.8432C1.95261 21.0372 1.97353 21.2379 2.05011 21.42C2.13317 21.5999 2.26781 21.7511 2.43696 21.8544C2.6061 21.9577 2.80211 22.0083 3.00011 22H12.0001C14.6523 22 17.1958 20.9464 19.0712 19.0711C20.9465 17.1957 22.0001 14.6522 22.0001 12C22.0001 9.34784 20.9465 6.8043 19.0712 4.92893C17.1958 3.05357 14.6523 2 12.0001 2ZM12.0001 20H5.41011L6.34011 19.07C6.4346 18.9774 6.50977 18.8669 6.56126 18.7451C6.61276 18.6232 6.63956 18.4923 6.64011 18.36C6.63635 18.0962 6.52852 17.8446 6.34011 17.66C5.0307 16.352 4.21528 14.6305 4.0328 12.7888C3.85032 10.947 4.31205 9.09901 5.33934 7.55952C6.36662 6.02004 7.8959 4.88436 9.66663 4.34597C11.4374 3.80759 13.34 3.8998 15.0503 4.60691C16.7607 5.31402 18.173 6.59227 19.0465 8.22389C19.9201 9.85551 20.201 11.7395 19.8412 13.555C19.4815 15.3705 18.5034 17.005 17.0736 18.1802C15.6439 19.3554 13.8509 19.9985 12.0001 20Z" fill={` ${click ? 'white' : '#3AB8FF'}`} />
                        </svg>
                        <div className="hidden 
                        m-0.5.
                        ..........................................................................................:block">Direct</div>
                    </div>
                </button>
                <button onClick={() => { setClick(false); setButton(true) }} className={`w-40  h-10 ${!click ? ' bg-sky-400 text-white' : 'bg-white text-sky-400'} rounded-full justify-center items-center inline-flex   border-2  border-sky-400`}>
                    <div className="justify-start  items-center gap-2 flex">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M6.6 6.9C6.6 7 6.7 7.1 6.8 7.2L8.8 9.2C9 9.4 9.2 9.5 9.5 9.5C9.8 9.5 10 9.4 10.2 9.2C10.6 8.8 10.6 8.2 10.2 7.8L9.9 7.5H14.1L13.8 7.8C13.6 8 13.5 8.2 13.5 8.5C13.5 9.1 13.9 9.5 14.5 9.5C14.8 9.5 15 9.4 15.2 9.2L17.2 7.2C17.3 7.1 17.4 7 17.4 6.9C17.4 6.8 17.5 6.7 17.5 6.5C17.5 6.4 17.5 6.2 17.4 6.1C17.3 6 17.3 5.9 17.2 5.8L15.2 3.8C14.8 3.4 14.2 3.4 13.8 3.8C13.4 4.2 13.4 4.8 13.8 5.2L14.1 5.5H9.9L10.2 5.2C10.6 4.8 10.6 4.2 10.2 3.8C9.8 3.4 9.2 3.4 8.8 3.8L6.8 5.8C6.7 5.9 6.6 6 6.6 6.1C6.6 6.2 6.5 6.3 6.5 6.5C6.5 6.6 6.5 6.8 6.6 6.9ZM6 14.7C7.4 14.7 8.6 13.5 8.6 12.1C8.6 10.7 7.4 9.5 6 9.5C4.6 9.5 3.4 10.7 3.4 12.1C3.4 13.5 4.6 14.7 6 14.7ZM9.8 17.4C7.2 15.3 3.4 15.7 1.3 18.3C1.1 18.6 1 18.9 1 19.2C1 19.9 1.6 20.5 2.3 20.5H9.7C10.2 20.5 10.7 20.2 10.9 19.8C11.1 19.4 11.1 18.8 10.7 18.4C10.4 18 10.1 17.7 9.8 17.4ZM15.4 12.1C15.4 13.5 16.6 14.7 18 14.7C19.4 14.7 20.6 13.5 20.6 12.1C20.6 10.7 19.4 9.5 18 9.5C16.6 9.5 15.4 10.7 15.4 12.1ZM22.7 18.4C22.4 18.1 22.1 17.7 21.8 17.5C19.2 15.4 15.4 15.8 13.3 18.4C13.1 18.6 13 18.9 13 19.2C13 19.9 13.6 20.5 14.3 20.5H21.7C22.2 20.5 22.7 20.2 22.9 19.8C23.1 19.3 23 18.8 22.7 18.4Z" fill={` ${click ? '#3AB8FF' : 'white'}`} />
                        </svg>
                        <div className="hidden md:block">Channels</div>
                    </div>
                </button>
            </div>
            <div className='w-full h-ful'>
                {click ? (
                    <DirectConversationList currentUser={currentUser} msg2={msg2} users={users} amis={amis} setStatus_Tow_User={setStatus_Tow_User} status_tow_user={status_tow_user} />
                ) : (
                    <ChannelsList msg2={msg2} users={users} setRoom={setRoom} setjoinchannel={setjoinchannel} Room={Room} setJoinRoom={setJoinRoom} />
                )}
            </div>
        </div>
    )
}

export default ConversationList