import { GAME_RESOLUTION, isOutsideGrid } from "./drawGameGrid";
import { getRandomInRange } from "../utils/getRandomInRange";
import { Coordinates } from "../types/Coordinates";
import { drawIslandPart, TileMap } from "./drawIslandPart";
import { IslandTiles } from "../types/IslandTiles";
import { Directions } from "../types/Directions";
import { getRandomFromArray } from "../utils/getRandomFromArray";
import { isEqual } from "lodash-es";
import { drawCircle } from "./drawCircle";
import { getPointsAround } from "../shapeCalculators/getPointsAround";
import { closeOpenShape } from "../shapeCalculators/closeOpenShape";
import { generateRandomPath } from "../shapeCalculators/generateRandomPath";
import { fillMissingGapsInShape } from "../shapeCalculators/fillInnerShape";
import { isPointInShape } from "../utils/isPointInShape";
import { moveByDirection } from "../utils/movePointByDirection";
import { getGridAroundPoint } from "../utils/getGridAroundPoint";
import { getIslandTileForPoint } from "../utils/getIslandTileForPoint";


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




    const islandShape = generateRandomIslandShape(startPosition);

    const blocks = islandShape.map(point => getIslandTileForPoint(islandShape, point));

    // const islandCenter = fillIslandCenters(islandShape);

    // drawCircle(ctx, startPosition, false)
    // islandShape.forEach((element, idx) => {
    //     setTimeout(() => drawCircle(ctx, element, false), 20 * idx);
    // })

    blocks.forEach((element, idx) => {
        setTimeout(() => drawIslandPart(ctx, element.tile, element.coord), 20 * idx);
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
    bottomLeft: ['left', 'bottom'],
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



function findIslandEdges(Points: Coordinates[]): DrawnParts[] {
    const edges: DrawnParts[] = [];
    Points.filter((point, index, allPoints) => {
        const freePointsAround = Object.entries(getPointsAround(point))
            .filter(([direction, coords]) => !allPoints.some(existingCoords => isEqual(existingCoords, coords)))

        if (!freePointsAround.length) {
            return false;
        }


        const pointSandDirections = freePointsAround.map(([direction]) => direction);
        const matchingTiles = Object.entries(SAND_DIRECTIONS).filter(([tileName, sandDirections]) => {
            return isEqual(pointSandDirections, sandDirections);
        }).map(([tileName]) => tileName) as IslandTiles[];
        console.log('for', point, matchingTiles)
        edges.push({ tile: getRandomFromArray<IslandTiles>(matchingTiles), coord: point });
    })

    return edges;
}


function generateRandomIslandShape(startPoint: Coordinates): Coordinates[] {
    const edge = closeOpenShape(generateRandomPath([startPoint], ISLAND_LENGTH));
    if (!edge.length) {
        return generateRandomIslandShape(startPoint);
    }
    const inside = fillMissingGapsInShape(edge);
    return [...edge, ...inside];
}

function fillIslandCenters(shape: Coordinates[]): DrawnParts[] {

    const centerBlocks: Coordinates[] = [];
    shape.forEach(point => {
        const grid = getGridAroundPoint(point);

        const isCenter = grid.every(gridPoint => {
            return isOutsideGrid(gridPoint) || isPointInShape(shape, gridPoint);
        })

        if (isCenter) {
            centerBlocks.push(point);
        }
    })

    return centerBlocks.map(coords => ({
        coord: coords,
        tile: getRandomFromArray<IslandTiles>(['center1', 'center2', 'center3', 'center4'])
    }));
}


