import { Coordinates } from "../types/Coordinates";
import { GAME_RESOLUTION } from "../painters/drawGameGrid";


function getXStep(ctx: CanvasRenderingContext2D): number {
    const {  width } = ctx.canvas;
    return width/GAME_RESOLUTION.x;
}

function getYStep(ctx: CanvasRenderingContext2D): number {
    const { height } = ctx.canvas;
    return height/GAME_RESOLUTION.y;
}


export function gridToPx(ctx: CanvasRenderingContext2D, coord: Coordinates): [number, number] {
    const xPos = getXStep(ctx) * coord.x;
    const yPos = getYStep(ctx) * coord.y;

    return [xPos, yPos];
}

export function gridCenterToPx(ctx: CanvasRenderingContext2D, coord: Coordinates): [number, number] {
    const xPos = getXStep(ctx) * coord.x;
    const yPos = getYStep(ctx) * coord.y;

    return [xPos + getXStep(ctx) / 2, yPos + getYStep(ctx) / 2];
}

export function pxToGrid(ctx: CanvasRenderingContext2D, x: number, y: number): Coordinates {
    const xPos = Math.floor(x / getXStep(ctx));
    const yPos = Math.floor(y/ getYStep(ctx));
    return {
        x: xPos,
        y: yPos,
    }
}