import { Coordinates } from "../types/Coordinates";
import { Directions } from "../types/Directions";


export function getPointsAround(point: Coordinates): Record<Directions, Coordinates> {
    return {
        top: { x: point.x, y: point.y - 1 },
        bottom: { x: point.x, y: point.y + 1 },
        left: { x: point.x - 1, y: point.y },
        right: { x: point.x + 1, y: point.y },
    }
}