import { Coordinates } from "../types/Coordinates";


export function getDistanceBetweenPoints(startPoint: Coordinates, endPoint: Coordinates): number {
    return Math.sqrt(Math.pow(startPoint.x - endPoint.x, 2) + Math.pow(startPoint.y - endPoint.y, 2))
}