import React, { useEffect, useRef } from 'react';
import './App.css';
import { drawBackground } from "./painters/drawBackground";
import { drawGameGrid } from "./painters/drawGameGrid";
import { drawCircle } from "./painters/drawCircle";
import { drawImageInGrid } from "./painters/drawImageInGrid";
import { drawIsland } from "./painters/drawIsland";



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
        const canvas = gameRef.current as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        drawBackground(ctx);
        drawGameGrid(ctx);
        drawCircle(ctx, { x: 5, y: 1 })


        drawIsland(ctx, 'topLeft', { x: 6, y: 4 });
        drawIsland(ctx, 'top1', { x: 7, y: 4 });
        drawIsland(ctx, 'top2', { x: 8, y: 4 });
        drawIsland(ctx, 'topRight', { x: 9, y: 4 });


    }, [hasLoaded])



  return (
    <div className="App">
      <canvas ref={gameRef} width={800} height={600} id={'main'} />
    </div>
  );
}

export default App;
