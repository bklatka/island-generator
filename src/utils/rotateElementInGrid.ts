import { Directions } from "../types/Directions";
import { Coordinates } from "../types/Coordinates";
import { gridCenterToPx } from "./gridToPx";


export function rotateElementInGrid(ctx: CanvasRenderingContext2D, direction: Directions, elementPosition: Coordinates, callback: (newCords: Coordinates) => void) {

        const angles = {
            top: 180,
            left: 90,
            right: 270,
            bottom: 0,
        }
        const angle = angles[direction];

        ctx.save();

        const rotateOrigin = gridCenterToPx(ctx, elementPosition);
        ctx.translate(...rotateOrigin)
        ctx.rotate(angle * Math.PI / 180);
        callback({ x: -0.5, y: -0.5 })
        ctx.restore();
    }