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
import { socket, socketManager } from "./network/connection";
import { PlayerCount } from "./components/PlayerCount";

function App() {

    const gameRef = useRef<HTMLCanvasElement>(null);

    const [hasLoaded, setHasLoaded] = React.useState(false)
    useEffect(() => {
        setHasLoaded(true)
    }, []);

    useEffect(() => {
        if (!hasLoaded) {
            return;
        }

        const layers: Layers = {
            islands: [],
            ships: [],
            canonballs: [],
            items: [],
        }
        const canvas = gameRef.current as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        drawBackground(ctx);

        if (GAME_CONFIG.SHOW_GRID) {
            drawGameGrid(ctx);
        }


        const game = new GameEngine(ctx, layers);

        game.addEntity(new Background(game))
        game.addEntity(new Grid(game))
        game.addEntity(new ItemGenerator(game))

        times(GAME_CONFIG.ISLAND_COUNT, () => {
            game.addIsland(new Island(game))
        })

        game.addShip(new Ship(game, 'player1', game.controls.player1, 'standard'))
        game.addShip(new Ship(game, 'player2', game.controls.player2, 'pirate'))

        game.addEntity(new UI(game))


        game.init();

        socket.emit('test', "This is my payload");


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

