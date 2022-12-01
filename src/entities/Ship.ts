import { Coordinates } from "../types/Coordinates";
import { getIslandPositions } from "../utils/getIslandPositions";
import { Entity } from "./Entity";
import Ship1 from '../assets/ships/ship1.png';
import Ship2 from '../assets/ships/ship2.png';
import Ship3 from '../assets/ships/ship3.png';
import Ship4 from '../assets/ships/ship4.png';
import { drawImageInGrid } from "../painters/drawImageInGrid";
import { GameEngine } from "./GameEngine";
import { moveByDirection } from "../utils/movePointByDirection";
import { getRandomFreePosition } from "../shapeCalculators/getRandomFreePosition";

export type ShipTypes = 1|2|3|4;


const SHIP_MAP = {
    1: Ship1,
    2: Ship2,
    3: Ship3,
    4: Ship4,
}

export class Ship extends Entity {
    public position: Coordinates;
    public shipType: ShipTypes = 1;

    constructor(game: GameEngine, shipType: ShipTypes = 1) {
        super(game);
        this.position = getRandomFreePosition(getIslandPositions(game.layers));
        this.shipType = shipType;
    }

    draw() {
        drawImageInGrid(this.game.ctx, SHIP_MAP[this.shipType], this.position);
    }

    update() {
        if (this.game.controls.player.up) {
            this.position = moveByDirection(this.position, 'top');
        }
    }


}