import React from 'react'
import Image from 'next/image'
import { userProps } from '@/interface/data'
const Stape = ({ currentUser, src, style, level, prevLevel }: { prevLevel: number, currentUser: userProps, src: string, style: string, level: number }) => {
    return (
        <div className={style + ` relative  w-full h-[30%]  rounded-xl flex justify-center items-center   `}>
            <div className={` w-[100px] h-[100px] lg:w-[120px] lg:h-[120px] relative  rounded-full  flex justify-center items-center`}>
                <div className={`w-[85%] h-[85%] ${currentUser.level > level ? 'bg-[#F9D809]' : 'bg-blue-300'}  rounded-full z-20 `}>
                    <div className="w-full h-full  relative rounded-full  overflow-hidden border-[8px] border-CusColor_grey ">
                        <Image className={level == 1 || level == 3 ? `mt-[11px] lg:mt-[13px]` : 'mt-[3px] lg:mt-[2px]'} src={`/game/grad/${src}.svg`} width={400} height={400} alt='1'></Image>
                    </div>
                    <Image className='CustomBorder  absolute bottom-3 -right-0' src={'/game/crown.png'} width={30} height={30} alt='1' />
                    <div className={` text-md font-bold absolute bottom-[14px] z-30 ${level > 9 ? 'right-[6px]' : 'right-[10px]'} text-yellow-600 text-center`}>{level}</div>
                </div>
                <svg viewBox="0 0 36 36" className=" absolute circular-chart orange  z-10  rotate-[120deg] ">
                    <path className="circle-bg"
                        d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path className="circle  stroke-[#F9D809]"
                        strokeDasharray={`${(currentUser.level - prevLevel) < 0 ? 0 : (((currentUser.level - prevLevel) * 100) / (level - prevLevel))}, 100`}
                        d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                </svg>
            </div>
        </div >
    )
}
const UserProgress = ({ currentUser }: { currentUser: userProps }) => {
    return (
        <div className='w-full h-full flex space-x-0 xl:-space-x-10 2xl:-space-x-30  '>
            <div className="w-[50%] h-full   flex flex-col justify-between ">
                <Stape currentUser={currentUser} style={'-right-4'} src={'grad-1'} level={10} prevLevel={8}></Stape>
                <Stape currentUser={currentUser} style={''} src={'grad-2'} level={5} prevLevel={3}></Stape>
                <Stape currentUser={currentUser} style={'-right-4'} src={'grad-5'} level={1} prevLevel={0}></Stape>

            </div>
            <div className="w-[50%] h-full  flex flex-col  justify-around  -space-y-32">
                <Stape currentUser={currentUser} style={''} src={'grad-3'} level={8} prevLevel={5}></Stape>
                <Stape currentUser={currentUser} style={''} src={'grad-4'} level={3} prevLevel={1}></Stape>
            </div>
        </div>
    )
}

export default UserProgress