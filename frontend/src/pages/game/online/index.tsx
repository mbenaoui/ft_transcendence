import ListOfFriends from '@/components/game/listOfFriends'
import Matching from '@/components/game/matching'
import PlayOnline from '@/components/game/online'
import Settings from '@/components/game/settings'
import { AppProps, userData, userProps } from '@/interface/data'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const Index = ({ onlineUsersss, socket }: AppProps) => {
    const router = useRouter()
    const [routerPage, setRouterPage] = useState('')
    const [ballTheme, setballTheme] = useState('/game/ball-2.svg')
    const [canvasTheme, setcanvasTheme] = useState('black')
    const [gameLevel, setgameLevel] = useState('esay')
    const [selectPlayer, setselectPlayer] = useState('online')
    const [listOfFriends, setlistOfFriends] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<userProps>(userData);
    const [opponent, setopponent] = useState<userProps>(userData);

    useEffect(() => {
        if (router.asPath == '/game/online?listoffriends=true') {
            setRouterPage('')
            setlistOfFriends(true)
        }
        else if (router.asPath == '/game/online?search=true') {
            setlistOfFriends(false)
            setRouterPage('search')
            setselectPlayer('matching')
        }
        else if (router.asPath == '/game/online?play=true') {
            setlistOfFriends(false)
            setRouterPage('play')
        }
        else if (router.asPath != '/game/online?play=true') {
            setlistOfFriends(false)
            setRouterPage('settings')
        }

    }, [router])

    const [gameIsOk, setgameIsOk] = useState(false)
    useEffect(() => {
        const handleBeforeUnload = (e: any) => {

            const confirmationMessage = 'Are you sure you want to leave? Your changes may not be saved.';
            e.returnValue = confirmationMessage;
            return confirmationMessage;
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
    }, [router]);

    return (
        <>
            {
                routerPage == 'play' ? (
                    < PlayOnline
                        selectPlayer={selectPlayer}
                        setselectPlayer={setselectPlayer}
                        ballTheme={ballTheme}
                        canvasTheme={canvasTheme}
                        socketApp={socket}
                        gameIsOk={gameIsOk}
                        setgameIsOk={setgameIsOk}
                        opponent={opponent}
                    />
                ) : routerPage == 'settings' ? (
                    <Settings
                        opponent={opponent}
                        setopponent={setopponent}
                        currentUser={currentUser}
                        setCurrentUser={setCurrentUser}
                        gameIsOk={gameIsOk}
                        setgameIsOk={setgameIsOk}
                        socket={socket} ballTheme={ballTheme} setballTheme={setballTheme} canvasTheme={canvasTheme} setcanvasTheme={setcanvasTheme}
                        setRouterPage={setRouterPage} gameLevel={gameLevel} setgameLevel={setgameLevel} selectPlayer={selectPlayer} />
                ) : null
            }
            {
                listOfFriends ? (
                    <div className=" absolute w-full">
                        <ListOfFriends onlineUsersss={onlineUsersss} socket={socket} />
                    </div>
                ) : null
            }
            {
                routerPage == 'search' ? (
                    <Matching socket={socket} />
                ) : null
            }
        </>
    )
}

export default Index

