import { GAME_RESOLUTION, isOutsideGrid } from "./drawGameGrid";
import { getRandomInRange } from "../utils/getRandomInRange";
import { Coordinates } from "../types/Coordinates";
import { drawIslandPart, TileMap } from "./drawIslandPart";
import { IslandTiles } from "../types/IslandTiles";
import { Directions } from "../types/Directions";
import { getRandomFromArray } from "../utils/getRandomFromArray";
import { isEqual } from "lodash-es";


const ISLAND_LENGTH = 10;

const CENTER_TILES = ['center1', 'center2', 'center3', 'center4']


interface DrawnParts {
    tile: IslandTiles;
    coord: Coordinates;
    start?: boolean;
}

export function drawRandomIsland(ctx: CanvasRenderingContext2D) {
    const drawnParts: DrawnParts[] = [];
    const startPosition = getRandomStartPosition();

    const tileOptions = Object.keys(TileMap).filter(tile => !CENTER_TILES.includes(tile)) as IslandTiles[];
    const startTile = tileOptions[getRandomInRange(0, tileOptions.length)];

    drawnParts.push({ tile: startTile, coord: startPosition, start: true, });


    for (let i = 0; i < ISLAND_LENGTH; i++) {
        const previousTile = drawnParts[i]

        const [newCord, directionToGo] = calculateNewPlaceToDraw(drawnParts, previousTile);

        if (newCord === null || directionToGo === null) {
            break;
        }

        const reversedDirection = REVERSED_DIRECTION_MAP[directionToGo];
        // find the right tile to go to the selected direction
        const possibleTiles: IslandTiles[] = Object.entries(PLACEMENT_RULES)
            .filter(([tileName]) => !CENTER_TILES.includes(tileName))
            .filter(([tileName, directions]) => directions.includes(reversedDirection))
            .filter(([tileName]) => {
                const previousSandDirections = SAND_DIRECTIONS[previousTile.tile];
                const currentSandDirections = SAND_DIRECTIONS[tileName as IslandTiles];
                return currentSandDirections.some(direction => previousSandDirections.includes(direction))
            })
            .map(([tileName]) => tileName) as IslandTiles[];
        const selectedTile = getRandomFromArray<IslandTiles>(possibleTiles);


        console.log(`going ${directionToGo} with ${selectedTile} from ${previousTile.coord.x}:${previousTile.coord.y} for ${newCord.x}:${newCord.y}`)

        drawnParts.push({ tile: selectedTile, coord: newCord });
    }


    drawnParts.forEach(({ tile, coord }) => {
        drawIslandPart(ctx, tile, coord);
    })

}


function getRandomStartPosition(): Coordinates {
    const { x, y } = GAME_RESOLUTION;

    return {
        x: getRandomInRange(0, x),
        y: getRandomInRange(0, y),
    }
}

const REVERSED_DIRECTION_MAP: Record<Directions, Directions> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
}

function moveByDirection(coord: Coordinates, direction: Directions) {
    const newCord = { ...coord };
    if (direction === 'left') {
        newCord.x = coord.x - 1;
    }
    if (direction === 'right') {
        newCord.x = coord.x + 1;
    }
    if (direction === 'top') {
        newCord.y = coord.y - 1
    }
    if (direction === 'bottom') {
        newCord.y = coord.y + 1;
    }

    if (newCord.x < 0 || newCord.y < 0 || newCord.x > GAME_RESOLUTION.x - 1 || newCord.y > GAME_RESOLUTION.y - 1) {
        return coord;
    }
    return newCord;
}

const PLACEMENT_RULES: Record<IslandTiles, Directions[]> = {
    bottom1: ['left', 'right'],
    bottom2: ['left', 'right'],
    top1: ['left', 'right'],
    top2: ['left', 'right'],
    left1: ['top', 'bottom'],
    left2: ['top', 'bottom'],
    right1: ['top', 'bottom'],
    right2: ['top', 'bottom'],
    topLeft: ['right', "bottom"],
    topRight: ['left', 'bottom'],
    bottomLeft: ['right', "top"],
    bottomRight: ['left', "top"],
    center1: ['top', 'left', 'right', 'bottom'],
    center2: ['top', 'left', 'right', 'bottom'],
    center3: ['top', 'left', 'right', 'bottom'],
    center4: ['top', 'left', 'right', 'bottom'],
    innerTopRight: ['top', 'right'],
    innerTopLeft: ['top', 'left'],
    innerBottomRight: ['bottom', 'right'],
    innerBottomLeft: ['bottom', 'left'],
}

const SAND_DIRECTIONS: Record<IslandTiles, Directions[]> = {
    bottom1: ['bottom'],
    bottom2: ['bottom'],
    top1: ['top'],
    top2: ['top'],
    left1: ['left'],
    left2: ['left'],
    right1: ['right'],
    right2: ['right'],
    center1: [],
    center2: [],
    center3: [],
    center4: [],
    topRight: ['top', 'right'],
    topLeft: ['top', 'left'],
    bottomRight: ['bottom', 'right'],
    bottomLeft: ['bottom', 'left'],
    innerBottomLeft: ['bottom', 'left'],
    innerTopRight: ['top', 'right'],
    innerBottomRight: ['bottom', 'right'],
    innerTopLeft: ['top', 'left'],
}

// const FAMILIES: Record<IslandTiles, Record<Directions, IslandTiles[]>> = {
//     bottom1: {
//         left: ['bottom1', 'bottom2', "bottomLeft", "innerBottomRight"],
//         right:['bottom1', 'bottom2', "bottomRight", "innerBottomLeft"],
//     },
//     bottom2: {
//         left: ['bottom1', 'bottom2', "bottomLeft", "innerBottomRight"],
//         right:['bottom1', 'bottom2', "bottomRight", "innerBottomLeft"],
//     },
//     left1: {
//         top: ['left1', 'left2', 'topLeft']
//     }
// }

function calculateNewPlaceToDraw(drawnElements: DrawnParts[], previousElement: DrawnParts): [Coordinates, Directions]|[null, null] {
    const optionsToGo: Directions[] = [...PLACEMENT_RULES[previousElement.tile]];

    const invalidDirections: Record<Directions, boolean> = { top: false, bottom: false, left: false, right: false };
    for (let optionIdx = 0; optionIdx < optionsToGo.length; optionIdx++) {
        const randomDirection = getRandomFromArray(optionsToGo.filter(el => !invalidDirections[el]))
        const newCord = moveByDirection(previousElement.coord, randomDirection);

        if (drawnElements.every(element => !isEqual(element.coord, newCord)) && !isOutsideGrid(newCord)) {
            return [newCord, randomDirection];
        }
        invalidDirections[randomDirection] = true;
    }

    console.warn('Cannot draw')
    return [null, null];


}
