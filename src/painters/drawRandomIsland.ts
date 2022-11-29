import { GAME_RESOLUTION, isOutsideGrid } from "./drawGameGrid";
import { getRandomInRange } from "../utils/getRandomInRange";
import { Coordinates } from "../types/Coordinates";
import { drawIslandPart, TileMap } from "./drawIslandPart";
import { IslandTiles } from "../types/IslandTiles";
import { Directions } from "../types/Directions";
import { getRandomFromArray } from "../utils/getRandomFromArray";
import { isEqual } from "lodash-es";
import { drawCircle } from "./drawCircle";


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

        const newPart = { tile: selectedTile, coord: newCord };


        console.log(`going ${directionToGo} with ${selectedTile} from ${previousTile.coord.x}:${previousTile.coord.y} for ${newCord.x}:${newCord.y}`)

        drawnParts.push(newPart);
    }

    const restWay = findWayHome(drawnParts);

    restWay.forEach((element, idx) => {
        setTimeout(() => drawCircle(ctx, element.coord), 300 * idx);
    })


    drawnParts.forEach(({ tile, coord }) => {
        drawIslandPart(ctx, tile, coord);
    })

}

const START_PADDING = 2;
function getRandomStartPosition(): Coordinates {
    const { x, y } = GAME_RESOLUTION;

    return {
        x: getRandomInRange(START_PADDING, x - START_PADDING),
        y: getRandomInRange(START_PADDING, y - START_PADDING),
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
    bottom1: ['top'],
    bottom2: ['top'],
    top1: ['bottom'],
    top2: ['bottom'],
    left1: ['right'],
    left2: ['right'],
    right1: ['left'],
    right2: ['left'],
    center1: [],
    center2: [],
    center3: [],
    center4: [],
    topRight: ['left', 'bottom'],
    topLeft: ['bottom', 'right'],
    bottomRight: ['top', 'left'],
    bottomLeft: ['top', 'right'],
    innerBottomLeft: ['top', 'right'],
    innerTopRight: ['left', 'bottom'],
    innerBottomRight: ['top', 'left'],
    innerTopLeft: ['bottom', 'right'],
}

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

function findWayHome(drawElements: DrawnParts[]): DrawnParts[] {
    const finalPoint = drawElements[drawElements.length - 1].coord;
    const startPoint = drawElements[0].coord;


    // assess what movement is possible by 1
    const possiblePoints = [
        { x: finalPoint.x, y: finalPoint.y - 1 },
         { x: finalPoint.x, y: finalPoint.y + 1 },
         { x: finalPoint.x - 1, y: finalPoint.y },
        { x: finalPoint.x + 1, y: finalPoint.y },
    ].filter(coords => !drawElements.some(el => isEqual(el.coord, coords)));

    if (!possiblePoints.length) {
        return drawElements;
    }

    // choose the one that is moving me towards start
    const results = possiblePoints.map(coord => Math.floor(Math.sqrt(Math.pow(startPoint.x - coord.x, 2) + Math.pow(startPoint.y - coord.y, 2))))
    const closestPoint = Math.min(...results);


    if (drawElements.length > 100) {
        console.warn('overflow')
        return drawElements;
    }
    const bestPoint = possiblePoints[results.indexOf(closestPoint)];

    if (closestPoint === 1) {
        return [...drawElements, { tile: 'center1', coord: bestPoint }];
    }

    console.log(`Best point[${closestPoint}] `, bestPoint, `Goal`, startPoint);
    // repeat
    return findWayHome([...drawElements, { tile: 'center1', coord: bestPoint }])

}
