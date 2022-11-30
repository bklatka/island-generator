import { Layers } from "../types/Layers";


export function getIslandPositions(layers: Layers) {
    return layers.islands.flatMap(i => i).map(part => part.coord);
}