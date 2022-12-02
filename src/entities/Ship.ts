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
import { gridCenterToPx, gridToPx } from "../utils/gridToPx";
import { GAME_RESOLUTION } from "../painters/drawGameGrid";
import { arePointsTheSame } from "../utils/arePointsTheSame";
import { GAME_CONFIG } from "../constants/GameConfig";
import { UserControls } from "../types/UserControls";
import { Canonball } from "./Canonball";
import { rotateElementInGrid } from "../utils/rotateElementInGrid";

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



    public shipType: ShipTypes = 1;


    private destinationPosition: Coordinates|null = null;
    private isShipMoving: boolean = false;

    private shipImage: HTMLImageElement;

    private shipSpeed: number = GAME_CONFIG.DEFAULT_SHIP_SPEED;
    private shipCanonDistance: number = GAME_CONFIG.DEFAULT_SHIP_CANON_DISTANCE;

    private controls: UserControls;

    private hasShootBall: boolean = false;

    private cooldownTime: number = 100;
    private cooldownStart: number = 0;

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


        rotateElementInGrid(this.game.ctx, this.direction, this.position, (shipCords) => {
            drawImageInGrid(this.game.ctx, this.shipImage, shipCords);
        })

        if (this.hasShootBall) {
            const { ctx, ticks } = this.game;
            const cooldownEnd = this.cooldownStart + this.cooldownTime
            const percentDone = (this.cooldownStart - ticks) / (this.cooldownStart - cooldownEnd);

            const maxCooldownWidth = GAME_RESOLUTION.getGridWidth(ctx);

            const [xPos, yPos] = gridToPx(ctx, this.position)

            ctx.fillStyle = '#c7a100'
            ctx.rect(xPos, yPos, maxCooldownWidth * percentDone, 5);
            ctx.fill()
        }
    }

    update() {
        this.game.debug.direction = this.direction;
        this.handleUserInput();
        this.stopAnimatingShipOnDestination();
        this.animateShipToDestination();
        this.countCannonCooldown();

        this.game.debug.playerPosition = this.position;
        this.game.debug.isShipMoving = this.isShipMoving;
        this.game.debug.destinationPosition = this.destinationPosition;
    }

    private handleUserInput() {
        this.handleUserMovement();
        this.handleUserShoot();
    }

    private handleUserShoot() {
        if (this.controls.shootLeft && !this.isShipMoving && !this.hasShootBall) {
            const shipDirectionToBallDirection: Record<Directions, Directions> = {
                top: 'left',
                left: 'bottom',
                right: 'top',
                bottom: 'right',
            }

            const ballDirection = shipDirectionToBallDirection[this.direction];
            this.shootBall(ballDirection)
        }

        if (this.controls.shootRight && !this.isShipMoving && !this.hasShootBall) {
            const shipDirectionToBallDirection: Record<Directions, Directions> = {
                top: 'right',
                left: 'top',
                right: 'bottom',
                bottom: 'left',
            }

            const ballDirection = shipDirectionToBallDirection[this.direction];
            this.shootBall(ballDirection)
        }
    }

    private countCannonCooldown() {
        if (this.hasShootBall && this.cooldownStart + this.cooldownTime < this.game.ticks) {
            this.hasShootBall = false;
        }
    }

    private shootBall(destination: Directions) {
        this.game.addEntity(new Canonball(this.game, 'ball', this.position, destination, 1, this.shipCanonDistance))
        this.hasShootBall = true;

        this.cooldownStart = this.game.ticks;
    }

    private handleUserMovement() {
        const pressedMoveButton: string|undefined = Object.entries(this.controls).filter(([key]) => ['up', 'down', 'left', 'right'].includes(key)).find(([key, isPressed]) => isPressed)?.[0]
        if (pressedMoveButton && !this.isShipMoving) {
            this.direction = ControlsToMove[pressedMoveButton] ?? this.direction;
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