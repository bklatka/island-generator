import { Coordinates } from "../types/Coordinates";
import { GAME_RESOLUTION } from "../painters/drawGameGrid";
import { getRandomInRange } from "../utils/getRandomInRange";
import { isPointInShape } from "../utils/isPointInShape";


const DEFAULT_START_PADDING = 2;

export function getRandomFreePosition(forbiddenZone: Coordinates[], padding = DEFAULT_START_PADDING): Coordinates {
    const { x, y } = GAME_RESOLUTION;

    const randomPoint = {
        x: getRandomInRange(padding, x - padding),
        y: getRandomInRange(padding, y - padding),
    }

    if (isPointInShape(forbiddenZone, randomPoint)) {
        return getRandomFreePosition(forbiddenZone);
    }

    return randomPoint;
}