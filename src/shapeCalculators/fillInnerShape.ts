import { Coordinates } from "../types/Coordinates";
import { getOutsideOfShape } from "./getOutsideOfShape";
import { findShapeEdges } from "./findShapeEdges";


export function fillMissingGapsInShape(shape: Coordinates[]): Coordinates[] {
    const outsidePath = getOutsideOfShape(shape);
    const [startEdge, endEdge] = findShapeEdges(shape);

    const inside: Coordinates[] = [];
    outsidePath.forEach(outsidePoint => {
        // find a point to the left

        if (startEdge.x === outsidePoint.x || endEdge.x === outsidePoint.x ||
        startEdge.y === outsidePoint.y || endEdge.y === outsidePoint.y) {
            return; // break, point is on the outside border
        }

        const sameYAxis = shape.filter(coord => coord.x === outsidePoint.x);
        const hasPointsOnTop = !!sameYAxis.filter(coords => coords.y < outsidePoint.y).length;
        const hasPointsOnBottom = !!sameYAxis.filter(coords => coords.y > outsidePoint.y).length;

        const sameXAxis = shape.filter(coord => coord.y === outsidePoint.y);
        const hasPointsOnLeft = !!sameXAxis.filter(coords => coords.x < outsidePoint.x).length;
        const hasPointsOnRight = !!sameXAxis.filter(coords => coords.x > outsidePoint.x).length;

        if (hasPointsOnLeft && hasPointsOnRight && hasPointsOnBottom && hasPointsOnTop) {
            inside.push(outsidePoint);
        }

    })

    return inside;
}