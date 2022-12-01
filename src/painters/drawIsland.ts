import { drawIslandPart } from "./drawIslandPart";
import { DrawnParts } from "../types/DrawBlock";


export function drawIsland(ctx: CanvasRenderingContext2D, islandBlocks: DrawnParts[]) {
    islandBlocks.forEach((element) => {
        drawIslandPart(ctx, element.tile, element.coord);
    })
}