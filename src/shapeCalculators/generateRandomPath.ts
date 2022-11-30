import { Coordinates } from "../types/Coordinates";
import { isEqual } from "lodash-es";
import { isOutsideGrid } from "../painters/drawGameGrid";
import { getRandomFromArray } from "../utils/getRandomFromArray";
import { getPointsAround } from "./getPointsAround";
import { isPointInShape } from "../utils/isPointInShape";

export function generateRandomPath(Points: Coordinates[], pathLength: number, forbiddenZone: Coordinates[] = []): Coordinates[] {
    const lastPoint = Points[Points.length - 1];


    if (Points.length === pathLength) {
        return Points
    }

    const possiblePoints = Object.values(getPointsAround(lastPoint)).filter(coords => !Points.some(el => isEqual(el, coords)))
        .filter(coords => !isOutsideGrid(coords, 1))
        .filter(coords => !isPointInShape(forbiddenZone, coords));

    if (!possiblePoints.length) {
        return Points;
    }


    const nextPoint = getRandomFromArray(possiblePoints);
    return generateRandomPath([...Points, nextPoint], pathLength, forbiddenZone);
}