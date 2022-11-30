import { Coordinates } from "../types/Coordinates";
import { Directions } from "../types/Directions";
import { GAME_RESOLUTION } from "../painters/drawGameGrid";

export function moveByDirection(coord: Coordinates, direction: Directions) {
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