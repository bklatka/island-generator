import { Coordinates } from "../types/Coordinates";
import { moveByDirection } from "./movePointByDirection";


export function getGridAroundPoint(point: Coordinates): Coordinates[] {
    return [
        moveByDirection(moveByDirection(point, 'top'), 'left'),
        moveByDirection(point, 'top'),
        moveByDirection(moveByDirection(point, 'top'), 'right'),
        moveByDirection(point, 'left'),
        moveByDirection(point, 'right'),
        moveByDirection(moveByDirection(point, 'bottom'), 'left'),
        moveByDirection(point, 'bottom'),
        moveByDirection(moveByDirection(point, 'bottom'), 'right'),
    ]
}
