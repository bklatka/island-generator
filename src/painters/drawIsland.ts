import { drawIslandPart } from "./drawIslandPart";
import { DrawnParts } from "../types/DrawBlock";


export function drawIsland(ctx: CanvasRenderingContext2D, islandBlocks: DrawnParts[], drawingDelay: number) {
    islandBlocks.forEach((element, idx) => {
        setTimeout(() => drawIslandPart(ctx, element.tile, element.coord), drawingDelay * idx);
    })
}