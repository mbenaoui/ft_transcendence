import { useRouter } from 'next/router';
import React, { LegacyRef, MutableRefObject, useRef, useState } from 'react'
import Image from 'next/image';
import { Constant } from '@/constants/constant';
const OnlineCard = ({ setselectPlayer }: { setselectPlayer: (selectPlayer: string) => void }) => {
    const [cantPlayOnline, setCantPlayOnline] = useState(false)

    const router = useRouter()
    const handelButtonPlayOnline = async () => {

        const response = await fetch(`${Constant.API_URL}/auth/user`, {
            credentials: 'include',
        });
        if (response.status == 200) {

            const content = await response.json()
            if (content.room == '' || content.room == null)
                router.push('/game/online?listoffriends=true')
            else {
                setCantPlayOnline(true)
            }
        }

        try {
        } catch (error) {

        }
    }
    
    return (
        <div className="w-full h-full flex  justify-center items-center ">
            <div className="OnlineCard  relative  overflow-hidden w-[100%] h-[90%]  flex flex-col justify-center items-center rounded-xl">
                <div id='Bottom' className={`w-[600px] h-[600px] -right-[400px] md:-right-[340px] xl:-right-[240px] absolute  rotate-[-45deg] `} />
                <div className=" w-full h-[90%] flex justify-center  z-40">
                    <div className="w-[50%] h-full  ">
                        <div className=" relative w-[170px] md:w-[250px] h-[50%] md:h-[70%]    bottom-[8px] md:bottom-[10px] xl:bottom-[20px]">
                            <Image className=' absolute ' src={'/game/OnlineCardStar.svg'} fill alt='l'></Image>
                        </div>
                    </div>
                    <div className="w-[50%] h-full  flex flex-col items-center justify-center  p-4  space-y-10">
                        <div className="w-full text-center   text-[#FFF] space-y-2">
                            <h1 className='text-3xl'>
                                Friend Match
                            </h1>
                            <div className="w-full text-[#9cbdff] text-center text-base md:text-xl">
                                <div className="">Creat a Match Room</div>
                                <div className="">and play online matches</div>
                            </div>
                        </div>
                        <button onClick={handelButtonPlayOnline} className=' bg-[#408CFF] hover:bg-[#82b4ff] hover:py-3 hover:px-14 hover:text-xl duration-150 text-[#FFF] py-2 px-12 rounded-md'>
                            Play
                        </button>
                    </div>
                </div>
                <div id='Bottom' className="w-full h-[10%] "></div>
            </div>
        </div>
        // {
        //     (cantPlayOnline) ? (
        //         <div className='w-full h-full  top-0 flex justify-center items-center z-50 absolute'>
        //             <div className=' shadow-2xl w-[300px] h-[200px] bg-white flex flex-col justify-around item-center  rounded-3xl'>
        //                 <div className="flex justify-around item-center ">
        //                     <h1 className=''>You can't Play now</h1>
        //                 </div>
        //                 <div className="flex justify-around item-center">
        //                     <button onClick={() => setCantPlayOnline((prev) => !prev)} className='bg-[#77A6F7] px-5  py-1 rounded-xl'>OK</button>
        //                 </div>
        //             </div>
        //         </div>) : null
        // }

    )
}

export default OnlineCard
