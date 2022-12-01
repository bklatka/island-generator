import { Coordinates } from "../types/Coordinates";
import { GAME_RESOLUTION } from "./drawGameGrid";
import { gridToPx } from "../utils/gridToPx";


export function drawImageInGridWithSrc(ctx: CanvasRenderingContext2D, image: string, coord: Coordinates) {
    const [posX, posY] = gridToPx(ctx, coord);
    const { getGridWidth, getGridHeight } = GAME_RESOLUTION

    const img = new Image();
    img.onload = () => {
        ctx.drawImage(img, posX, posY, getGridWidth(ctx), getGridHeight(ctx));
    };
    img.src = image;
}

export function drawImageInGrid(ctx: CanvasRenderingContext2D, image: HTMLImageElement, coord: Coordinates) {
    const [posX, posY] = gridToPx(ctx, coord);
    const { getGridWidth, getGridHeight } = GAME_RESOLUTION

    ctx.drawImage(image, posX, posY, getGridWidth(ctx), getGridHeight(ctx));
}
