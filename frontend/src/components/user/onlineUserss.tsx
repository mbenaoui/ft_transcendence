
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { userProps } from '@/interface/data';
import Image from 'next/image';
import Link from 'next/link';
import { FreeMode, Pagination } from 'swiper/modules';
import { useEffect, useState } from 'react';
const OnlineUserss = ({ onlineUsersss, amis }: { onlineUsersss: Array<number>, amis: Array<userProps> }) => {
    const [windowWidth, setWindoWidth] = useState(1)
    useEffect(() => {
        const handleRisize = () => {
            setWindoWidth(window.innerWidth)
        }
        window.addEventListener('resize', handleRisize);
        setWindoWidth(window?.innerWidth)
        return () => {
            window.removeEventListener('resize', handleRisize);
        };

    }, [])
    return (
        <Swiper

            slidesPerView={windowWidth > 768 ? windowWidth / 300 : windowWidth / 120}
            pagination={{
                clickable: true,
            }}
            className="mySwiper w-full h-full px-10"
        >
            {
                amis.map((user) => (
                    <SwiperSlide key={user.id + '_'} className='relative  h-full  w-full' >
                        <Link href={'/users/' + user.username + '.' + String(user.id)} className="w-full h-full  flex items-center  ">
                            <div className="w-[90px] h-[90px] bg-slate-400  rounded-full  flex items-center justify-center">
                                <div className="w-[85px] h-[85px] bg-white  rounded-full flex items-center justify-center">
                                    <div className="w-[80px] h-[80px] relative ">
                                        <Image className='rounded-full' style={{ objectFit: "cover" }} src={user.foto_user} alt={user.username} fill></Image>
                                        <div className={`absolute top-1 right-0 w-[15px] h-[15px] rounded-full flex items-center justify-center bg-white  ${true ? 'bg-green-400' : 'bg-red-400'} `}>
                                            <div className={`w-[10px] h-[10px] rounded-full ${onlineUsersss.includes(user.id) ? 'bg-green-400' : 'bg-red-400'} `} >
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}



        </Swiper>
    );
}
export default OnlineUserss
