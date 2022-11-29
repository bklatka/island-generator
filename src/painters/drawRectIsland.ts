import { Coordinates } from "../types/Coordinates";
import { drawIslandCenter, drawIslandEdge, drawIslandPart } from "./drawIslandPart";


export function drawRectIsland(ctx: CanvasRenderingContext2D, coord: Coordinates, width: number, height: number) {

    drawIslandPart(ctx, 'topLeft', coord);
    drawIslandPart(ctx, 'topRight', { x: coord.x + width - 1, y: coord.y });
    drawIslandPart(ctx, 'bottomLeft', { x: coord.x, y: coord.y + height - 1 });
    drawIslandPart(ctx, 'bottomRight', { x: coord.x + width - 1, y: coord.y + height - 1 });

    drawIslandEdge(ctx, { x: coord.x + 1, y: coord.y }, 'top', width - 2);
    drawIslandEdge(ctx, { x: coord.x + 1, y: coord.y + height - 1 }, 'bottom', width - 2);
    drawIslandEdge(ctx, { x: coord.x, y: coord.y + 1 }, 'left', height - 2);
    drawIslandEdge(ctx, { x: coord.x + width - 1, y: coord.y + 1 }, 'right', height - 2);


    drawIslandCenter(ctx, { x: coord.x + 1, y: coord.y + 1 }, width - 2, height - 2);
}