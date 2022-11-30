import React, { useEffect, useRef } from 'react';
import './App.css';
import { drawBackground } from "./painters/drawBackground";
import { drawGameGrid } from "./painters/drawGameGrid";
import { generateRandomIsland } from "./painters/generateRandomIsland";
import { drawIsland } from "./painters/drawIsland";
import { DRAWING_DELAY } from "./constants/timers";
import { DrawnParts } from "./types/DrawBlock";

interface Layers {
    islands: DrawnParts[][],
    ships: any[];
}

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
        drawGameGrid(ctx);



        layers.islands.push(
            generateRandomIsland(ctx, layers.islands.flatMap(part => part).map(part => part.coord))
        );

        layers.islands.push(
            generateRandomIsland(ctx, layers.islands.flatMap(part => part).map(part => part.coord))
        );

        layers.islands.push(
            generateRandomIsland(ctx, layers.islands.flatMap(part => part).map(part => part.coord))
        );


        layers.islands.forEach(island => {
            drawIsland(ctx, island, DRAWING_DELAY);
        })


    }, [hasLoaded])



  return (
    <div className="App">
      <canvas ref={gameRef} width={800} height={600} id={'main'} />
    </div>
  );
}

export default App;
