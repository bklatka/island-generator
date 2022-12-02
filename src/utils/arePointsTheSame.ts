import { Coordinates } from "../types/Coordinates";


/* due to calculations we want to assume points are in the same place if they are more less correct */
export function arePointsTheSame(firstPoint: Coordinates, secondPoint: Coordinates, accuracy = 0.01) {

    const { x, y } = firstPoint;
    const { x: xs, y: ys } = secondPoint;

    const xAreEqual = Math.abs(x - xs) < accuracy;
    const yAreEqual = Math.abs(y - ys) < accuracy;

    return xAreEqual && yAreEqual;

}