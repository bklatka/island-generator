import { Coordinates } from "../types/Coordinates";
import { GAME_RESOLUTION, getGridPosition } from "./drawGameGrid";


export function drawCircle(ctx: CanvasRenderingContext2D, coord: Coordinates) {
    const [xPos, yPos] = getGridPosition(ctx, coord);

    const radius = GAME_RESOLUTION.getGridWidth(ctx)/2

    ctx.strokeStyle = '#ff3636';
    ctx.beginPath()
    ctx.arc(xPos + radius, yPos + radius, GAME_RESOLUTION.getGridWidth(ctx)/2, 0, 2*Math.PI);
    ctx.stroke();

}