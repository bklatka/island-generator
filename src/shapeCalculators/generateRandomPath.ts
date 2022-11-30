import { Coordinates } from "../types/Coordinates";
import { isEqual } from "lodash-es";
import { isOutsideGrid } from "../painters/drawGameGrid";
import { getRandomFromArray } from "../utils/getRandomFromArray";
import { getPointsAround } from "./getPointsAround";

export function generateRandomPath(Points: Coordinates[], pathLength: number): Coordinates[] {
    const lastPoint = Points[Points.length - 1];


    if (Points.length === pathLength) {
        return Points
    }

    const possiblePoints = Object.values(getPointsAround(lastPoint)).filter(coords => !Points.some(el => isEqual(el, coords)))
        .filter(coords => !isOutsideGrid(coords, 1));

    if (!possiblePoints.length) {
        return Points;
    }


    const nextPoint = getRandomFromArray(possiblePoints);
    return generateRandomPath([...Points, nextPoint], pathLength);
}