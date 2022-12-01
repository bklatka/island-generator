import React, { useEffect, useRef } from 'react';
import './App.css';
import { drawBackground } from "./painters/drawBackground";
import { drawGameGrid } from "./painters/drawGameGrid";
import { GAME_CONFIG } from "./constants/GameConfig";
import { Layers } from "./types/Layers";
import { Ship } from "./entities/Ship";
import { GameEngine } from "./entities/GameEngine";
import { Island } from "./entities/Island";
import { Background } from "./entities/Background";
import { Grid } from "./entities/Grid";

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
            ships: []
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
        game.addEntity(new Island(game))
        game.addEntity(new Island(game))
        game.addEntity(new Ship(game, 'player1', game.controls.player1, 1))
        game.addEntity(new Ship(game, 'player2', game.controls.player2, 2))


        game.init();



    }, [hasLoaded])



  return (
    <div className="App">
        <p>Player 1: Arrow keys to move, "." and "/" to shoot </p>
        <p>Player 2: WASD to move, "e" and "q" to shoot</p>
      <canvas ref={gameRef} width={800} height={600} id={'main'} />
    </div>
  );
}

export default App;

