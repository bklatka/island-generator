import React, { useEffect, useRef } from 'react';
import './App.css';
import { drawBackground } from "./painters/drawBackground";
import { drawGameGrid } from "./painters/drawGameGrid";
import { generateRandomIsland } from "./painters/generateRandomIsland";
import { drawIsland } from "./painters/drawIsland";
import { times } from "lodash-es";
import { GAME_CONFIG } from "./constants/GameConfig";
import { Layers } from "./types/Layers";
import { getRandomFreePosition } from "./utils/getRandomFreePosition";
import { getIslandPositions } from "./utils/getIslandPositions";
import { drawImageInGrid } from "./painters/drawImageInGrid";
import Ship from './assets/ships/ship1.png'

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

        times(GAME_CONFIG.ISLAND_COUNT, () => {
            addRandomIsland(layers);
        })

        const shipStartPoint = getRandomFreePosition(getIslandPositions(layers))

        drawImageInGrid(ctx, Ship, shipStartPoint);


        layers.islands.forEach(island => {
            drawIsland(ctx, island, 10);
        })


    }, [hasLoaded])



  return (
    <div className="App">
      <canvas ref={gameRef} width={800} height={600} id={'main'} />
    </div>
  );
}

export default App;


function addRandomIsland(layers: Layers) {
    layers.islands.push(
        generateRandomIsland(layers.islands.flatMap(part => part).map(part => part.coord))
    );
}