import Link from 'next/link'
import React from 'react'
import Image from 'next/image'
const ComputerCard = ({ setselectPlayer }: { setselectPlayer: (selectPlayer: string) => void }) => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="ComputerCard  relative  overflow-hidden w-[100%]  h-[90%]   bg-CusColor_grey flex flex-col justify-center items-center rounded-xl">
        <div id='Bottom' className={`w-[600px] h-[600px] -right-[400px] md:-right-[340px] xl:-right-[240px] absolute  rotate-[-45deg] `} />
        <div className=" w-full h-[90%] flex justify-center  z-40">
          <div className="w-[50%] h-full  ">
            <div className=" relative w-[170px] md:w-[250px] h-[50%] md:h-[70%]    bottom-[8px] md:bottom-[10px] xl:bottom-[20px]">
              <Image className=' absolute ' src={'/game/ComputerCardStart.svg'} fill alt='l' />
            </div>
          </div>
          <div className="w-[50%] h-full  flex flex-col items-center justify-center  p-4  space-y-10">
            <div className="w-full text-center   text-[#b7771e] space-y-2">
              <h1 className='text-3xl'>
                Trial Match
              </h1>
              <div className="w-full text-[#D97D00] text-center text-base md:text-xl">
                <div className="">Enjoy casual matches</div>
                <div className="">with this offline game mode</div>
              </div>
            </div>
            <Link href={"/game/ai?settings=true"} onClick={() => setselectPlayer('computer')} className=' bg-[#B76E00] hover:bg-[#dfa246] hover:py-3 hover:px-14 hover:text-xl duration-150 text-[#FFF] py-2 px-12 rounded-md'>
              Play
            </Link>
          </div>
        </div>
        <div id='Bottom' className="w-full h-[10%] "></div>
      </div>
    </div>
  )
}

export default ComputerCard
