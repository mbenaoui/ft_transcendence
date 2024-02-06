import { Navigation, Pagination, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Image from 'next/image';
import OnlineCard from './cards/onlineCard';
import ComputerCard from './cards/computerCard';
import MatchingCard from './cards/matchingCard';
import { GameCardsProps } from '@/interface/data';


export const GameCards = ({ currentUser, socket, setselectPlayer }: GameCardsProps) => {
    return (

        <div className=" relative w-full h-full ">
            <Swiper
                className='w-full h-full max-w-[1000px] flex justify-center items-center'
                modules={[Navigation, Pagination, A11y]}
                slidesPerView={1}
                spaceBetween={70}
                pagination={{
                    clickable: true,
                }}
            >
                <SwiperSlide >
                    <OnlineCard setselectPlayer={setselectPlayer} />
                </SwiperSlide>
                <SwiperSlide className='w-full h-full ' >
                    <MatchingCard setselectPlayer={setselectPlayer} />
                </SwiperSlide>
                <SwiperSlide className='w-full h-full ' >
                    <ComputerCard setselectPlayer={setselectPlayer} />
                </SwiperSlide>
            </Swiper >

        </div >

    );
};