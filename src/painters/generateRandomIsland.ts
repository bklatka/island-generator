import { GAME_RESOLUTION } from "./drawGameGrid";
import { getRandomInRange } from "../utils/getRandomInRange";
import { Coordinates } from "../types/Coordinates";
import { drawIslandPart, TileMap } from "./drawIslandPart";
import { IslandTiles } from "../types/IslandTiles";
import { closeOpenShape } from "../shapeCalculators/closeOpenShape";
import { generateRandomPath } from "../shapeCalculators/generateRandomPath";
import { fillMissingGapsInShape } from "../shapeCalculators/fillInnerShape";
import { getIslandTileForPoint } from "../utils/getIslandTileForPoint";
import { DrawnParts } from "../types/DrawBlock";
import { CENTER_TILES } from "../constants/BlockGroups";


const ISLAND_LENGTH = 30;


export function generateRandomIsland(ctx: CanvasRenderingContext2D, size: number = ISLAND_LENGTH) {
    const drawnParts: DrawnParts[] = [];
    const startPosition = getRandomStartPosition();

    const tileOptions = Object.keys(TileMap).filter(tile => !CENTER_TILES.includes(tile)) as IslandTiles[];
    const startTile = tileOptions[getRandomInRange(0, tileOptions.length)];

    drawnParts.push({ tile: startTile, coord: startPosition });


    const islandShape = generateRandomIslandShape(startPosition, size);

    const blocks = islandShape.map(point => getIslandTileForPoint(islandShape, point));

    return blocks;

}

const START_PADDING = 2;
function getRandomStartPosition(): Coordinates {
    const { x, y } = GAME_RESOLUTION;

    return {
        x: getRandomInRange(START_PADDING, x - START_PADDING),
        y: getRandomInRange(START_PADDING, y - START_PADDING),
    }
}

function generateRandomIslandShape(startPoint: Coordinates, islandSize: number): Coordinates[] {
    const edge = closeOpenShape(generateRandomPath([startPoint], islandSize));
    if (!edge.length) {
        return generateRandomIslandShape(startPoint, islandSize);
    }
    const inside = fillMissingGapsInShape(edge);
    return [...edge, ...inside];
}
