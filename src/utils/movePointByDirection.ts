import { Coordinates } from "../types/Coordinates";
import { Directions } from "../types/Directions";
import { GAME_RESOLUTION, isOutsideGrid } from "../painters/drawGameGrid";
import { isPointInShape } from "./isPointInShape";

export function moveByDirection(coord: Coordinates, direction: Directions, forbiddenZone: Coordinates[] = []) {
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

    if (isOutsideGrid(newCord) || isPointInShape(forbiddenZone, newCord)) {
        return coord;
    }
    return newCord;
}