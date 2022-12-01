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
import { Directions } from "../types/Directions";
import { gridCenterToPx } from "../utils/gridToPx";
import { GAME_RESOLUTION } from "../painters/drawGameGrid";
import { arePointsTheSame } from "../utils/arePointsTheSame";
import { GAME_CONFIG } from "../constants/GameConfig";
import { UserControls } from "../types/UserControls";

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

const SHIP_SPEED_DIVIDER = 300;
export class Ship extends Entity {
    public id: string;
    public position: Coordinates;
    public direction: Directions = 'bottom';
    private destinationPosition: Coordinates|null = null;

    public shipType: ShipTypes = 1;
    private shipImage: HTMLImageElement;
    private isShipMoving: boolean = false;

    private shipSpeed: number = GAME_CONFIG.DEFAULT_SHIP_SPEED;

    private controls: UserControls;

    constructor(game: GameEngine, id: string, controls: UserControls, shipType: ShipTypes = 1) {
        super(game);
        this.position = getRandomFreePosition(getIslandPositions(game.layers));
        this.shipType = shipType;
        this.shipImage = new Image();
        this.shipImage.src = SHIP_MAP[shipType];
        this.id = id;
        this.controls = controls;
    }

    draw() {
        this.rotateShip(this.direction, (shipCords) => {
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
        this.handleUserInput();
        this.stopAnimatingShipOnDestination();
        this.animateShipToDestination();

        this.game.debug.playerPosition = this.position;
        this.game.debug.isShipMoving = this.isShipMoving;
        this.game.debug.destinationPosition = this.destinationPosition;
    }

    private handleUserInput() {
        const pressedButton: string|undefined = Object.entries(this.controls).find(([key, isPressed]) => isPressed)?.[0]
        if (pressedButton && !this.isShipMoving) {
            this.direction = ControlsToMove[pressedButton];
            this.destinationPosition = moveByDirection(this.position, this.direction, getIslandPositions(this.game.layers))

        }
    }

    private stopAnimatingShipOnDestination() {
        if (this.destinationPosition && arePointsTheSame(this.position, this.destinationPosition)) {
            this.destinationPosition = null;
            this.isShipMoving = false;
            // cleanup after animation movement
            this.position = {
                x: Math.round(this.position.x),
                y: Math.round(this.position.y),
            }
        }
    }

    private animateShipToDestination() {
        if (this.destinationPosition) {
            this.isShipMoving = true;

            const horizontalMove = this.destinationPosition.x - this.position.x;
            const verticalMove = this.destinationPosition.y - this.position.y;

            this.position = {
                x: this.position.x + horizontalMove * GAME_RESOLUTION.getGridWidth(this.game.ctx) / SHIP_SPEED_DIVIDER * this.shipSpeed,
                y: this.position.y + verticalMove * GAME_RESOLUTION.getGridHeight(this.game.ctx) / SHIP_SPEED_DIVIDER * this.shipSpeed,
            }

        }
    }


}