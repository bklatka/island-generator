import { Coordinates } from "../types/Coordinates";
import { getIslandPositions } from "../utils/getIslandPositions";
import { Entity } from "./Entity";
import Ship1 from '../assets/ships/ship1.png';
import Ship2 from '../assets/ships/ship2.png';
import Ship3 from '../assets/ships/ship3.png';
import Ship4 from '../assets/ships/ship4.png';
import { drawImageInGrid, drawImageInGridWithSrc } from "../painters/drawImageInGrid";
import { GameEngine } from "./GameEngine";
import { moveByDirection } from "../utils/movePointByDirection";
import { getRandomFreePosition } from "../shapeCalculators/getRandomFreePosition";
import { drawCircle } from "../painters/drawCircle";
import { Directions } from "../types/Directions";
import { getGridCenterInPx } from "../utils/getGridCenterInPx";
import { gridCenterToPx, gridToPx } from "../utils/gridToPx";
import { GAME_RESOLUTION } from "../painters/drawGameGrid";

export type ShipTypes = 1|2|3|4;


const ControlsToMove: Record<string, Directions> = {
    up: 'top',
    left: 'left',
    down: 'bottom',
    right: 'right'
}

const SHIP_MAP = {
    1: Ship1,
    2: Ship2,
    3: Ship3,
    4: Ship4,
}

export class Ship extends Entity {
    public position: Coordinates;
    public shipType: ShipTypes = 1;
    private nextMove: Directions|null = null;
    private previousMove: Directions = 'bottom';
    private moveTick: number = 0;
    private shipImage: HTMLImageElement;

    constructor(game: GameEngine, shipType: ShipTypes = 1) {
        super(game);
        this.position = getRandomFreePosition(getIslandPositions(game.layers));
        this.shipType = shipType;
        this.shipImage = new Image();
        this.shipImage.src = SHIP_MAP[shipType];
    }

    draw() {
        this.rotateShip(this.previousMove, (shipCords) => {
            drawImageInGrid(this.game.ctx, this.shipImage, shipCords);
        })
    }

    rotateShip(direction: Directions, callback: (newCords: Coordinates) => void) {
        const angles = {
            top: 180,
            left: 90,
            right: 270,
            bottom: 0,
        }
        const angle = angles[direction];

        const { ctx } = this.game;
        ctx.save();

        const rotateOrigin = gridCenterToPx(ctx, this.position);
        ctx.translate(...rotateOrigin)
        ctx.rotate(angle * Math.PI / 180);
        callback({ x: -0.5, y: -0.5 })
        ctx.restore();

    }

    update() {
        this.game.debug.playerPosition = this.position;
        const pressedButton: string|undefined = Object.entries(this.game.controls.player).find(([key, isPressed]) => isPressed)?.[0]
        if (pressedButton) {
            this.nextMove = ControlsToMove[pressedButton];
            this.previousMove = this.nextMove;
            this.moveTick = this.game.ticks;
        }

        if (this.game.ticks === this.moveTick + 1 && this.nextMove) {
            this.position = moveByDirection(this.position, this.nextMove, getIslandPositions(this.game.layers))

            this.nextMove = null;
        }
    }


}