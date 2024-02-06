import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { AppProps, userProps } from '@/interface/data'
import { getTheDateAndTheTime } from './listOfFriends'
import { Constant } from '@/constants/constant'
import { useRouter } from 'next/router'
function findUserbyId(users: Array<userProps>, userId: Number) {
    const user = users.find((item) => {
        return item.id == userId
    })
    return user
}
const History = ({ currentUser, users }: { users: Array<userProps>, currentUser: userProps }) => {
    const [matchs, setMatchs] = useState<Array<any>>([])
    const [ok, setoK] = useState(false)
    const router = useRouter()
    useEffect(() => {
        (
            async () => {
                setMatchs([])
                try {
                    const response = await fetch(`${Constant.API_URL}/game/history`, {
                        credentials: 'include',
                    });
                    if (response.status == 200) {
                        const content = await response.json()
                        setMatchs(content)
                        setoK(true)
                    }
                } catch (error) {

                }
            }
        )();
    }, [])
    const handelClearHistorique = async () => {
        const response = await fetch(`${Constant.API_URL}/game/history`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (response.status == 200) {
            setMatchs([])
        }
        try {
        } catch (error) {

        }
    }
    if (ok)
        return (
            <div className='w-full h-full'>
                <div className='   w-full  h-full rounded-xl flex flex-col items-center justify-start space-y-5' >
                    <div className=" relative bg-rded-200 w-full h-10 flex justify-center items-center">
                        <div className="w-[200px] h-[10px] bg-yellow-300"></div>
                        <div className="w-[200px]  text-yellow-300 uppercase text-center text-3xl">
                            Historique
                        </div>
                        <div className="w-[200px] h-[10px] bg-yellow-300"></div>
                        <button onClick={() => handelClearHistorique()} hidden={(matchs.length ? false : true)} className=" absolute  right-1 px-5 py-1  bg-blue-500  hover:bg-blue-300 rounded-lg top-7">Clear</button>
                    </div>
                    {
                        (matchs.length) ? matchs.map((match: any) => (
                            <div key={match.createdAt} className="w-[96%] ms:w-[80%] h-14  rounded-xl flex flex-col justify-center item-center">
                                <div className="bg-blue-800 mx-[20%] text-sm  text-center rounded-t-3xl h-10 mt-2 text-white flex justify-center items-center">
                                    {getTheDateAndTheTime(match.createdAt)}
                                </div>
                                <div className="bg-blue-500 w-full flex justify-center items-start h-16 rounded-md">
                                    <div className=" w-[40%] h-full flex justify-between items-center">
                                        <div className=" relative h-full w-12">
                                            <Image className='w-12 rounded-md'
                                                src={match.opponent.foto_user} fill style={{ objectFit: "cover" }} alt={'player Image'}>
                                            </Image>
                                        </div>
                                        <h1 className='pr-4 md:pr-10  uppercase text-white font-bold text-sm lg:text-xl'>{match.opponent.username}</h1>
                                    </div>
                                    <div className="bg-blue-800 w-[20%] h-12 flex flex-col justify-end item">
                                        <div className='bg-reds-400 flex justify-around items-center space-x-1 text-xl font-bold text-white'>
                                            <span>{match.opponentGools}</span>
                                            <span>-</span>
                                            <span>{match.myGools}</span>
                                        </div>
                                        <div className="w-15 h-3 bg-yellow-300  rounded-t-[8px] ">
                                        </div>
                                    </div>
                                    <div className=" w-[40%] h-full flex justify-between items-center">
                                        <h1 className='pl-4 md:pl-10  uppercase text-white font-bold text-sm lg:text-xl'>{currentUser.username}</h1>
                                        <div className=" relative h-full w-12">
                                            <Image className='w-12 rounded-md'
                                                src={currentUser.foto_user} fill style={{ objectFit: "cover" }} alt={'player Image'}>
                                            </Image>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className={`${matchs.length == 0 ? ' flex ' : ' hidden '} w-full 300   justify-center `}>
                                <footer className='w-[60%] min-w-[400px] max-w-[760px]  rounded-2xl pb-10 flex flex-col justify-center items-center space-y-3 '>
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
                                        <h1>No Match found</h1>
                                    </div>
                                    <div className=' w-[50%]   text-center'>
                                        <h2> Sorry, We couldn't find any match </h2>
                                        {/* <h2 className={`${currentPath == '/search' ? 'hidden' : 'block'}`}>with the name "{query}" .Please try again.</h2> */}
                                    </div>
                                    <div className="space-x-3">
                                        <button onClick={() => router.push('/game/online?listoffriends=true')} className='w-[120px] border-2 border-white py-2  rounded-md  font-bold hover:bg-slate-300 duration-300 '>Create Match</button>
                                        {/* <button onClick={undefined} className='w-[120px] border-2  bg-blue-300 py-2  text-blue-800 rounded-md  font-bold hover:bg-blue-400 duration-300'>Get back</button> */}
                                    </div>
                                </footer>
                            </div>
                        )
                    }
                </div>
            </div>
        )
    return (
        <div className='w-full h-full bg-blue-400'></div>
    )
}

export default History
