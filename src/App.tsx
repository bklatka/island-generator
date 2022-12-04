import React, { useEffect, useRef } from 'react';
import './App.css';
import { drawBackground } from "./painters/drawBackground";
import { drawGameGrid } from "./painters/drawGameGrid";
import { GAME_CONFIG } from "./constants/GameConfig";
import { Layers } from "./types/Layers";
import { Ship } from "./entities/ship/Ship";
import { GameEngine } from "./entities/GameEngine";
import { Island } from "./entities/Island";
import { Background } from "./entities/Background";
import { Grid } from "./entities/Grid";
import { ItemGenerator } from "./entities/ItemGenerator";
import { UI } from "./entities/UI";
import { times } from "lodash-es";
import { socket } from "./network/connection";
import { PlayerCount } from "./components/PlayerCount";
import { generateRandomIsland } from "./shapeCalculators/generateRandomIsland";
import { IslandPainter } from "./entities/IslandPainter";

function App() {

    const gameRef = useRef<HTMLCanvasElement>(null);

    const [hasLoaded, setHasLoaded] = React.useState(false)
    const [isCreator, setIsCreator] = React.useState(false);
    useEffect(() => {
        socket.on('userJoined', (playerCount) => {
            if (playerCount === 2) {
                setHasLoaded(true)
            }
        });

        socket.on('setAsCreator', () => setIsCreator(true))

    }, []);

    useEffect(() => {
        if (!hasLoaded) {
            return;
        }


        const canvas = gameRef.current as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;




        const layers: Layers = {
            islands: new Array(GAME_CONFIG.ISLAND_COUNT)
                .fill([{ coord: [] }])
                .map((emptyArr, index, islands) => generateRandomIsland(islands.map(island => island.coord))),
            ships: [],
            canonballs: [],
            items: [],
        }

        const game = new GameEngine(ctx, layers);

        game.addEntity(new Background(game))
        game.addEntity(new Grid(game))
        game.addEntity(new ItemGenerator(game))
        game.addEntity(new IslandPainter(game))


        game.addShip(new Ship(game, 'player1', game.controls.player1, 'standard'))
        // game.addShip(new Ship(game, 'player2', game.controls.player2, 'pirate'))

        game.addEntity(new UI(game))


        game.init();




    }, [hasLoaded])



  return (
    <div className="App" id={"App"}>
        <PlayerCount />

        <div className="game-wrapper">
            <div className={"finish-msg"}>
                Game finished!
                {/* eslint-disable-next-line no-restricted-globals */}
                <a href={"/"}>Press here to restart</a>
            </div>
      <canvas ref={gameRef} width={800} height={600} id={'main'} />
        </div>
    </div>
  );
}

export default App;

