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
        drawImageInGrid(this.game.ctx, this.shipImage, this.position);
    }

    update() {
        const pressedButton: string|undefined = Object.entries(this.game.controls.player).find(([key, isPressed]) => isPressed)?.[0]
        if (pressedButton) {
            this.nextMove = ControlsToMove[pressedButton];
            this.moveTick = this.game.ticks;
        }

        if (this.game.ticks === this.moveTick + 1 && this.nextMove) {
            this.position = moveByDirection(this.position, this.nextMove, getIslandPositions(this.game.layers))
            this.nextMove = null;
        }
    }


}