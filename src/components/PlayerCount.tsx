import { useEffect, useState } from "react";
import { socket } from "../network/connection";


interface Room {
    id: string;
    name: string;
    players: string[];
}

export const PlayerCount = () => {



    const [noRoom, setNoRoom] = useState(false)
    const [playerCount, setPlayerCount] = useState(0)
    useEffect(() => {
        socket.on('noRoom', () => setNoRoom(true))
        socket.on('joined', (playerCount: number) => {
            setPlayerCount(playerCount);
        })

        socket.on('userJoined', (playerCount) => {
            setPlayerCount(playerCount);
        })

        socket.on('userLeft', (playerCount) => {
            console.log(playerCount);
            setPlayerCount(playerCount);
        })
    }, [])

    if (noRoom) {
        return <p>Sorry currently the game is full</p>
    }

    if (playerCount === 0) {
        return <p>joining the game</p>
    }

    return <div>
        <h4>Players {playerCount}/2 </h4>
        {playerCount !== 2 && <p>Waiting for player</p>}
    </div>
}