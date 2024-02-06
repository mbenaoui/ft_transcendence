import PlayWithComputer from '@/components/game/computer'
import Settings from '@/components/game/settings'
import { fetchCurrentUser } from '@/hooks/userHooks'
import { AppProps, userData, userProps } from '@/interface/data'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

const Index = ({ socket }: AppProps) => {
    const router = useRouter()
    const [routerPage, setRouterPage] = useState('')
    const [ballTheme, setballTheme] = useState('/game/ball-2.svg')
    const [canvasTheme, setcanvasTheme] = useState('black')
    const [gameLevel, setgameLevel] = useState('esay')
    const [selectPlayer, setselectPlayer] = useState('computer')
    const [currentUser, setCurrentUser] = useState<userProps>(userData);
    const [opponent, setopponent] = useState<userProps>(userData);

    fetchCurrentUser({ setCurrentUser })
    useEffect(() => {
        if (router.asPath != '/game/ai?play=true')
            setRouterPage('')
    }, [router])
    const [gameIsOk, setgameIsOk] = useState(false)

    return (
        <>
            {
                routerPage == 'play' ? (
                    <PlayWithComputer currentUser={currentUser} selectPlayer={selectPlayer} setselectPlayer={setselectPlayer} ballTheme={ballTheme}
                        canvasTheme={canvasTheme} gameLevel={gameLevel} />
                ) : (
                    <Settings
                        opponent={opponent}
                        setopponent={setopponent}
                        currentUser={currentUser}
                        setCurrentUser={setCurrentUser}
                        gameIsOk={gameIsOk} setgameIsOk={setgameIsOk} ballTheme={ballTheme} setballTheme={setballTheme} canvasTheme={canvasTheme} setcanvasTheme={setcanvasTheme}
                        setRouterPage={setRouterPage} gameLevel={gameLevel} setgameLevel={setgameLevel} selectPlayer={selectPlayer} socket={socket} />
                )
            }
        </>
    )
}

export default Index
