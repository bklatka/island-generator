import { Coordinates } from "../types/Coordinates";


export function roundGridPosition(position: Coordinates): Coordinates {
    return {
        x: Math.round(position.x),
        y: Math.round(position.y),
    }
}