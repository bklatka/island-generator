import { Coordinates } from "../types/Coordinates";
import { GAME_RESOLUTION, getGridPosition } from "./drawGameGrid";


export function drawImageInGrid(ctx: CanvasRenderingContext2D, image: string, coord: Coordinates) {
    const [posX, posY] = getGridPosition(ctx, coord);
    const { getGridWidth, getGridHeight } = GAME_RESOLUTION

    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, posX, posY, getGridWidth(ctx), getGridHeight(ctx));
    };
    img.src = image;
}