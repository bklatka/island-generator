import { Coordinates } from "../types/Coordinates";
import { isEqual } from "lodash-es";
import { isPointInShape } from "../utils/isPointInShape";


export function closeOpenShape(points: Coordinates[], forbiddenZone: Coordinates[]): Coordinates[] {
    const finalPoint = points[points.length - 1];
    const startPoint = points[0];


    // assess what movement is possible by 1
    const possiblePoints = [
        { x: finalPoint.x, y: finalPoint.y - 1 },
        { x: finalPoint.x, y: finalPoint.y + 1 },
        { x: finalPoint.x - 1, y: finalPoint.y },
        { x: finalPoint.x + 1, y: finalPoint.y },
    ].filter(coords => !isPointInShape(points, coords) && !isPointInShape(forbiddenZone, coords));

    if (!possiblePoints.length) {
        console.error('Cannot close shape :(')
        return [];
    }

    // choose the one that is moving me towards start
    const results = possiblePoints.map(coord => Math.sqrt(Math.pow(startPoint.x - coord.x, 2) + Math.pow(startPoint.y - coord.y, 2)))
    const closestPoint = Math.min(...results);


    if (points.length > 100) {
        console.warn('overflow')
        return points;
    }
    const bestPoint = possiblePoints[results.indexOf(closestPoint)];

    if (closestPoint < 1.1) {
        return [...points, bestPoint];
    }



    console.log(`Best point[${closestPoint}] `, bestPoint, `Goal`, startPoint);
    // repeat
    return closeOpenShape([...points, bestPoint ], forbiddenZone)

}