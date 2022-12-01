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
        game.addEntity(new Ship(game, 1))
        game.addEntity(new Island(game))


        game.init();



    }, [hasLoaded])



  return (
    <div className="App">
      <canvas ref={gameRef} width={800} height={600} id={'main'} />
    </div>
  );
}

export default App;

