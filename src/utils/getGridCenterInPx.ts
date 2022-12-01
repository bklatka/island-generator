import { Coordinates } from "../types/Coordinates";
import { GAME_RESOLUTION } from "../painters/drawGameGrid";


export function getGridCenterInPx(ctx: CanvasRenderingContext2D, point: Coordinates): [number, number] {
    const { getGridWidth, getGridHeight } = GAME_RESOLUTION;

    const gridWidth = getGridWidth(ctx);
    const gridHeight = getGridHeight(ctx);

    return [point.x * gridWidth + gridWidth/2, point.y * gridHeight + gridHeight/2]
}