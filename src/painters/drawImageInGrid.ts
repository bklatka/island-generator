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

export function drawImageInGrid(ctx: CanvasRenderingContext2D, image: HTMLImageElement, coord: Coordinates, scale: number = 1) {
    const [posX, posY] = gridToPx(ctx, coord);
    const { getGridWidth, getGridHeight } = GAME_RESOLUTION

    const gridW = getGridWidth(ctx);
    const gridH = getGridHeight(ctx);


    const imageWidth = gridW * scale;
    const imageHeight = gridH * scale;

    ctx.save();
    ctx.translate(posX, posY);
    ctx.drawImage(image, gridW / 2 - imageWidth / 2, gridH / 2 - imageHeight / 2, gridW * scale, gridH * scale);
    ctx.restore();
}
