import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Constant } from '@/constants/constant';
const MatchingCard = ({ setselectPlayer }: { setselectPlayer: (selectPlayer: string) => void }) => {
    const router = useRouter();
    const handelButtonPlayOnline = async () => {
        try {

            const response = await fetch(`${Constant.API_URL}/auth/user`, {
                credentials: 'include',
            });
            if (response.status == 200) {

                const content = await response.json()
                if (content.isOnline === false) {
                    setselectPlayer('matching')
                    router.push('/game/online?search=true')
                }
                else {
                }
            }

        } catch (error) {

        }

    }
    return (
        <div className="w-full h-full flex justify-center items-center">
            <div className="MatchingCard  relative  overflow-hidden w-[100%] h-[90%] bg-CusColor_grey flex flex-col justify-center items-center rounded-xl">
                <div id='Bottom' className={`w-[600px] h-[600px] -right-[400px] md:-right-[340px] xl:-right-[240px] absolute  rotate-[-45deg] `} />
                <div className=" w-full h-[90%] flex justify-center  z-40">
                    <div className="w-[50%] h-full  ">
                        <div className=" relative w-[170px] md:w-[250px] h-[50%] md:h-[70%]    bottom-[8px] md:bottom-[10px] xl:bottom-[20px]">
                            <Image className=' absolute ' src={'/game/MatchingCardStar.svg'} fill alt='l'></Image>
                        </div>
                    </div>
                    <div className="w-[50%] h-full  flex flex-col items-center justify-center  p-4  space-y-10">
                        <div className="w-full text-center   text-[#FFB800] space-y-2">
                            <h1 className='text-3xl'>
                                Online Quick Match
                            </h1>
                            <div className="w-full text-[#A6881C] text-center text-base md:text-xl">
                                <div className="">Play against users online</div>
                            </div>
                        </div>
                        <button onClick={handelButtonPlayOnline} className=' bg-[#c3a64e] hover:bg-[#e2c867] text-[#55461f] hover:py-3 hover:px-14 hover:text-xl duration-150  py-2 px-12 rounded-md'>
                            Play
                        </button>
                    </div>
                </div>
                <div id='Bottom' className="w-full h-[10%] "></div>
            </div>
        </div>
    )
}

export default MatchingCard