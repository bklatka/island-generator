import { Coordinates } from "../types/Coordinates";


/* due to calculations we want to assume points are in the same place if they are more less correct */
export function arePointsTheSame(firstPoint: Coordinates, secondPoint: Coordinates) {

    const { x, y } = firstPoint;
    const { x: xs, y: ys } = secondPoint;

    const xAreEqual = Math.abs(x - xs) < 0.01;
    const yAreEqual = Math.abs(y - ys) < 0.01;

    return xAreEqual && yAreEqual;

}