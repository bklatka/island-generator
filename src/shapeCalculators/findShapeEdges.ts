import { Coordinates } from "../types/Coordinates";


export function findShapeEdges(islandBasicShape: Coordinates[]): [Coordinates, Coordinates] {
    const xAxis = islandBasicShape.map(cord => cord.x)
    const yAxis = islandBasicShape.map(cord => cord.y);

    const startEdge = {
        x: Math.min(...xAxis),
        y: Math.min(...yAxis),
    };
    const endEdge = {
        x: Math.max(...xAxis),
        y: Math.max(...yAxis),
    }

    return [startEdge, endEdge]
}