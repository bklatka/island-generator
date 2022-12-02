import { GAME_RESOLUTION } from "../painters/drawGameGrid";
import { Coordinates } from "../types/Coordinates";


const DEFAULT_SPEED_DIVIDER = 500;
export function animateElementToDestination(ctx: CanvasRenderingContext2D, currentPosition: Coordinates, destination: Coordinates, speed: number, speedDivider: number = DEFAULT_SPEED_DIVIDER): Coordinates {
    if (!destination) {
        return currentPosition;
    }
        const horizontalMove = destination.x - currentPosition.x;
        const verticalMove = destination.y - currentPosition.y;

        return {
            x: currentPosition.x + horizontalMove * GAME_RESOLUTION.getGridWidth(ctx) / speedDivider * speed,
            y: currentPosition.y + verticalMove * GAME_RESOLUTION.getGridHeight(ctx) / speedDivider * speed,
        }


}


