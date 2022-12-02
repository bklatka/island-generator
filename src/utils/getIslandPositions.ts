import { Layers } from "../types/Layers";
import { Coordinates } from "../types/Coordinates";


export function getIslandPositions(layers: Layers): Coordinates[] {
    return layers.islands.flatMap(i => i).flatMap(island => island.blocks.map(block => block.coord));
}