import { Coordinates } from "../types/Coordinates";
import { GAME_RESOLUTION } from "./drawGameGrid";
import { gridToPx } from "../utils/gridToPx";


export function drawCircle(ctx: CanvasRenderingContext2D, coord: Coordinates, fill: boolean = false, color: string = '#ff3636') {
    const [xPos, yPos] = gridToPx(ctx, coord);

    const radius = GAME_RESOLUTION.getGridWidth(ctx)/2

    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath()
    ctx.arc(xPos + radius, yPos + radius, GAME_RESOLUTION.getGridWidth(ctx)/2, 0, 2*Math.PI);
    ctx.stroke();
    if (fill) {
        ctx.fill();
    }

}