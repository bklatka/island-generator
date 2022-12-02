import { Coordinates } from "../../types/Coordinates";
import { getIslandPositions } from "../../utils/getIslandPositions";
import { Entity } from "../Entity";
import { drawImageInGrid } from "../../painters/drawImageInGrid";
import { GameEngine } from "../GameEngine";
import { moveByDirection } from "../../utils/movePointByDirection";
import { getRandomFreePosition } from "../../shapeCalculators/getRandomFreePosition";
import { Directions } from "../../types/Directions";
import { gridToPx } from "../../utils/gridToPx";
import { GAME_RESOLUTION } from "../../painters/drawGameGrid";
import { arePointsTheSame } from "../../utils/arePointsTheSame";
import { GAME_CONFIG } from "../../constants/GameConfig";
import { UserControls } from "../../types/UserControls";
import { Canonball } from "../Canonball";
import { rotateElementInGrid } from "../../utils/rotateElementInGrid";
import { animateElementToDestination } from "../../utils/animateMovement";
import { roundGridPosition } from "../../utils/roundGridPosition";
import { ShipHealthState } from "./ShipHealthState";
import { ShipType } from "../../types/Ship";


const ControlsToMove: Record<string, Directions> = {
    up: 'top',
    left: 'left',
    down: 'bottom',
    right: 'right'
}



const DEFAULT_HEALTH = 100;
export class Ship extends Entity {
    // Base props
    public id: string;
    public position: Coordinates;
    public direction: Directions = 'bottom';

    // Game props
    private health: number = DEFAULT_HEALTH;
    private isDead: boolean = false;
    private maxHealth: number = DEFAULT_HEALTH;
    private shipSpeed: number = GAME_CONFIG.DEFAULT_SHIP_SPEED;
    private shipCanonDistance: number = GAME_CONFIG.DEFAULT_SHIP_CANON_DISTANCE;

    private destinationPosition: Coordinates|null = null;
    private isShipMoving: boolean = false;


    private controls: UserControls;

    private shipState: ShipHealthState;

    private hasShootBall: boolean = false;

    private cooldownTime: number = 100;
    private cooldownStart: number = 0;

    constructor(game: GameEngine, id: string, controls: UserControls, shipType: ShipType = 'standard') {
        super(game);
        this.position = getRandomFreePosition(getIslandPositions(game.layers));

        this.shipState = new ShipHealthState(game, shipType)

        this.id = id;
        this.controls = controls;
    }

    draw() {
        rotateElementInGrid(this.game.ctx, this.direction, this.position, (shipCords) => {
            drawImageInGrid(this.game.ctx, this.shipState.shipImage, shipCords);
        })

        if (this.hasShootBall) {
            this.drawCooldownBar();
        }

        this.drawHealthBar();
    }

    update() {
        this.handleShipDead();
        this.handleUserInput();
        this.stopAnimatingShipOnDestination();
        this.animateShipToDestination();
        this.countCannonCooldown();

        this.shipState.update(this.health, this.maxHealth);
    }

    public takeDamage(canonBall: Canonball) {
        this.health = this.health - canonBall.power;
    }


    private drawCooldownBar() {
        const { ctx, ticks } = this.game;
        const cooldownEnd = this.cooldownStart + this.cooldownTime
        const percentDone = (this.cooldownStart - ticks) / (this.cooldownStart - cooldownEnd);

        const maxCooldownWidth = GAME_RESOLUTION.getGridWidth(ctx);

        const [xPos, yPos] = gridToPx(ctx, this.position)


        ctx.beginPath();
        ctx.fillStyle = '#ffdd18'
        ctx.rect(xPos, yPos, maxCooldownWidth * percentDone, 5);
        ctx.fill();
    }

    private drawHealthBar() {
        const { ctx } = this.game;

        const [xPos, yPos] = gridToPx(ctx, this.position);
        const gridHeight = GAME_RESOLUTION.getGridHeight(ctx);
        const gridWidth = GAME_RESOLUTION.getGridWidth(ctx);

        const percentHealth = this.health/this.maxHealth;

        ctx.beginPath();
        ctx.fillStyle = '#1fff24'
        ctx.rect(xPos, yPos + gridHeight - 5, gridWidth * percentHealth, 5);
        ctx.fill();

    }

    private handleUserInput() {
        if (this.isDisposed || this.isDead) {
            return;
        }
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

    private shootBall(direction: Directions) {
        this.game.addCanonball(new Canonball(this.game, 'ball', moveByDirection(this.position, direction), direction, 20, this.shipCanonDistance))
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
            this.position = roundGridPosition(this.position);
        }
    }

    private animateShipToDestination() {
        if (this.destinationPosition) {
            this.position = animateElementToDestination(this.game.ctx, this.position, this.destinationPosition, this.shipSpeed);
            this.isShipMoving = true;
        }
    }

    private handleShipDead() {
        if (this.health <= 0) {
            this.isDead = true;
            setTimeout(() => {
                this.isDisposed = true;
            }, GAME_CONFIG.DEAD_SHIP_LIVING_TIME);
        }

    }


}