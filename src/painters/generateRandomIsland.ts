import { getRandomInRange } from "../utils/getRandomInRange";
import { Coordinates } from "../types/Coordinates";
import { TileMap } from "./drawIslandPart";
import { IslandTiles } from "../types/IslandTiles";
import { closeOpenShape } from "../shapeCalculators/closeOpenShape";
import { generateRandomPath } from "../shapeCalculators/generateRandomPath";
import { fillMissingGapsInShape } from "../shapeCalculators/fillInnerShape";
import { getIslandTileForPoint } from "../utils/getIslandTileForPoint";
import { DrawnParts } from "../types/DrawBlock";
import { CENTER_TILES } from "../constants/BlockGroups";
import { getRandomFreePosition } from "../utils/getRandomFreePosition";


const ISLAND_LENGTH = 30;


export function generateRandomIsland(forbiddenZone: Coordinates[] = [], size: number = ISLAND_LENGTH): DrawnParts[] {
    const drawnParts: DrawnParts[] = [];
    const startPosition = getRandomFreePosition(forbiddenZone);

    const tileOptions = Object.keys(TileMap).filter(tile => !CENTER_TILES.includes(tile)) as IslandTiles[];
    const startTile = tileOptions[getRandomInRange(0, tileOptions.length)];

    drawnParts.push({ tile: startTile, coord: startPosition });


    const islandShape = generateRandomIslandShape(startPosition, size, forbiddenZone);

    return islandShape.map(point => getIslandTileForPoint(islandShape, point));

}



function generateRandomIslandShape(startPoint: Coordinates, islandSize: number, forbiddenZone: Coordinates[]): Coordinates[] {
    const edge = closeOpenShape(generateRandomPath([startPoint], islandSize, forbiddenZone), forbiddenZone);
    if (!edge.length) {
        return generateRandomIslandShape(startPoint, islandSize, forbiddenZone);
    }
    const inside = fillMissingGapsInShape(edge);
    return [...edge, ...inside];
}
