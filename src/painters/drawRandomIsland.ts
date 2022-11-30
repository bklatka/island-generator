import { GAME_RESOLUTION, isOutsideGrid } from "./drawGameGrid";
import { getRandomInRange } from "../utils/getRandomInRange";
import { Coordinates } from "../types/Coordinates";
import { drawIslandPart, TileMap } from "./drawIslandPart";
import { IslandTiles } from "../types/IslandTiles";
import { Directions } from "../types/Directions";
import { getRandomFromArray } from "../utils/getRandomFromArray";
import { isEqual } from "lodash-es";
import { drawCircle } from "./drawCircle";
import { start } from "repl";


const ISLAND_LENGTH = 30;

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


    drawCircle(ctx, startPosition, true)

    const paths = findWayHome(generateRandomPath([startPosition]));

    const edgesToDraw = findIslandEdges(paths);

    paths.filter(path => !edgesToDraw.map(e => e.coord).some(edge => isEqual(path, edge))).forEach((element, idx) => {
        setTimeout(() => drawCircle(ctx, element), 100 * idx);
    })

    edgesToDraw.forEach((element, idx) => {
        setTimeout(() => drawIslandPart(ctx, element.tile, element.coord), 100 * idx);
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
    topRight: ['right', 'top'],
    topLeft: ['left', 'top'],
    bottomRight: ['right', 'bottom'],
    bottomLeft: [], //['left', 'bottom'],
    innerBottomLeft: [], //['bottom', 'left'],
    innerTopRight: [], //['top', 'right'],
    innerBottomRight: [], //['bottom', 'right'],
    innerTopLeft: [], //['top', 'left'],
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

function findWayHome(drawElements: Coordinates[]): Coordinates[] {
    const finalPoint = drawElements[drawElements.length - 1];
    const startPoint = drawElements[0];


    // assess what movement is possible by 1
    const possiblePoints = [
        { x: finalPoint.x, y: finalPoint.y - 1 },
         { x: finalPoint.x, y: finalPoint.y + 1 },
         { x: finalPoint.x - 1, y: finalPoint.y },
        { x: finalPoint.x + 1, y: finalPoint.y },
    ].filter(coords => !drawElements.some(el => isEqual(el, coords)));

    if (!possiblePoints.length) {
        console.error('no way home :(')
        return drawElements;
    }

    // choose the one that is moving me towards start
    const results = possiblePoints.map(coord => Math.sqrt(Math.pow(startPoint.x - coord.x, 2) + Math.pow(startPoint.y - coord.y, 2)))
    const closestPoint = Math.min(...results);


    if (drawElements.length > 100) {
        console.warn('overflow')
        return drawElements;
    }
    const bestPoint = possiblePoints[results.indexOf(closestPoint)];

    if (closestPoint < 1.1) {
        return [...drawElements, bestPoint];
    }



    console.log(`Best point[${closestPoint}] `, bestPoint, `Goal`, startPoint);
    // repeat
    return findWayHome([...drawElements, bestPoint ])

}


function generateRandomPath(Points: Coordinates[]): Coordinates[] {
    const lastPoint = Points[Points.length - 1];

    if (Points.length === ISLAND_LENGTH) {
        return Points
    }

    const possiblePoints = Object.values(getPointsAround(lastPoint)).filter(coords => !Points.some(el => isEqual(el, coords)))
    .filter(coords => !isOutsideGrid(coords, 1));

    if (!possiblePoints.length) {
        return Points;
    }


    const nextPoint = getRandomFromArray(possiblePoints);
    return generateRandomPath([...Points, nextPoint]);
}

function getPointsAround(point: Coordinates): Record<Directions, Coordinates> {
    return {
        top: { x: point.x, y: point.y - 1 },
        bottom: { x: point.x, y: point.y + 1 },
        left: { x: point.x - 1, y: point.y },
        right: { x: point.x + 1, y: point.y },
    }
}

function findIslandEdges(Points: Coordinates[]): DrawnParts[] {
    const edges: DrawnParts[] = [];
    Points.filter((point, index, allPoints) => {
        const freePointsAround = Object.entries(getPointsAround(point))
            .filter(([direction, coords]) => !allPoints.some(existingCoords => isEqual(existingCoords, coords)))

        if (!freePointsAround.length) {
            return false;
        }
        if (freePointsAround.length === 1) {
            console.log('Found free point', point, freePointsAround)
        }


        const pointSandDirections = freePointsAround.map(([direction]) => direction);
        const matchingTiles = Object.entries(SAND_DIRECTIONS).filter(([tileName, sandDirections]) => {
            return isEqual(pointSandDirections, sandDirections);
        }).map(([tileName]) => tileName) as IslandTiles[];
        edges.push({ tile: getRandomFromArray<IslandTiles>(matchingTiles), coord: point });
    })

    return edges;
}

function isGridEmpty(elements: Coordinates[], point: Coordinates): boolean {
    return !elements.some(e => isEqual(e, point))
}