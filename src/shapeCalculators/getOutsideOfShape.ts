import { Coordinates } from "../types/Coordinates";
import { findShapeEdges } from "./findShapeEdges";
import { isPointInShape } from "../utils/isPointInShape";


export function getOutsideOfShape(shape: Coordinates[]): Coordinates[] {
    const [shapeStart, shapeEnd] = findShapeEdges(shape);

    const outside = [];
    for (let x = shapeStart.x; x < shapeEnd.x + 1; x++) {
        for (let y = shapeStart.y; y < shapeEnd.y + 1; y++) {
            const currentPoint = { x, y };
            if (!isPointInShape(shape, currentPoint)) {
                outside.push(currentPoint);
            }
        }
    }

    return outside;
}