import React, { useEffect, useRef } from 'react';
import './App.css';
import { drawBackground } from "./painters/drawBackground";
import { drawGameGrid } from "./painters/drawGameGrid";
import { drawRectIsland } from "./painters/drawRectIsland";


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

        drawRectIsland(ctx, { x: 5, y: 4 }, 5, 6);


    }, [hasLoaded])



  return (
    <div className="App">
      <canvas ref={gameRef} width={800} height={600} id={'main'} />
    </div>
  );
}

export default App;
