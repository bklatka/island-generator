import { Coordinates } from "../types/Coordinates";
import { isEqual } from "lodash-es";


export function isPointInShape(shape: Coordinates[], point: Coordinates): boolean {
    return shape.some(shapePart => isEqual(shapePart, point));
}