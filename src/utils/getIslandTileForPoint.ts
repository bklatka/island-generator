import { Coordinates } from "../types/Coordinates";
import { getGridAroundPoint, getStructuredGridAroundPoint } from "./getGridAroundPoint";
import { isOutsideGrid } from "../painters/drawGameGrid";
import { isPointInShape } from "./isPointInShape";
import { IslandTiles } from "../types/IslandTiles";
import { getRandomFromArray } from "./getRandomFromArray";





const TILE_TO_RESULT_MAP: Record<string, IslandTiles[]> = {
    '00001011': ['topLeft'],
    '00001111': ['topLeft'],
    '00101011': ['topLeft'],
    '00101111': ['topLeft'],
    '00011111': ['top1', 'top2'],
    '10111111': ['top1', 'top2'],
    '00111111': ['top1', 'top2'],
    '10011111': ['top1', 'top2'],
    '00010110': ['topRight'],
    '00010111': ['topRight'],
    '10010111': ['topRight'],
    '10010110': ['topRight'],
    '01101011': ['left1', 'left2'],
    '01101111': ['left1', 'left2'],
    '11101011': ['left1', 'left2'],
    '11101111': ['left1', 'left2'],
    '11010110': ['right1', 'right2'],
    '11110111': ['right1', 'right2'],
    '11010111': ['right1', 'right2'],
    '11110110': ['right1', 'right2'],
    '11111000': ['bottom1', 'bottom2'],
    '11111100': ['bottom1', 'bottom2'],
    '11111101': ['bottom1', 'bottom2'],
    '11111001': ['bottom1', 'bottom2'],
    '01101000': ['bottomLeft'],
    '11101000': ['bottomLeft'],
    '01101001': ['bottomLeft'],
    '11101001': ['bottomLeft'],
    '11010000': ['bottomRight'],
    '11110000': ['bottomRight'],
    '11010100': ['bottomRight'],
    '11110100': ['bottomRight'],
    '01111111': ['innerTopLeft'],
    '11011111': ['innerTopRight'],
    '11111110': ['innerBottomRight'],
    '11111011': ['innerBottomLeft'],
    '11111111': ['center1', 'center2', 'center3', 'center4'],
}

export function getIslandTileForPoint(islandShape: Coordinates[], point: Coordinates) {

    const grid = getGridAroundPoint(point);

    const resolvedString = grid.map(cell => isOutsideGrid(cell) || isPointInShape(islandShape, cell) ? 1 : 0).join('');

    const tile = getRandomFromArray(TILE_TO_RESULT_MAP[resolvedString] ?? [])

    return {
        coord: point,
        tile: tile ?? 'center1',
    }
}