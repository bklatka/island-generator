import { Coordinates } from "../../types/Coordinates";
import { getIslandPositions } from "../../utils/getIslandPositions";
import { Entity } from "../Entity";
import { drawImageInGrid } from "../../painters/drawImageInGrid";
import { GameEngine } from "../GameEngine";
import { moveByDirection } from "../../utils/movePointByDirection";
import { getRandomFreePosition } from "../../shapeCalculators/getRandomFreePosition";
import { Directions } from "../../types/Directions";
import { arePointsTheSame } from "../../utils/arePointsTheSame";
import { GAME_CONFIG } from "../../constants/GameConfig";
import { UserControls } from "../../types/UserControls";
import { Canonball } from "../Canonball";
import { rotateElementInGrid } from "../../utils/rotateElementInGrid";
import { animateElementToDestination } from "../../utils/animateMovement";
import { roundGridPosition } from "../../utils/roundGridPosition";
import { ShipHealthState } from "./ShipHealthState";
import { ShipType } from "../../types/Ship";
import { Cannon } from "./Cannon";
import { ItemType } from "../../types/ItemType";


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

    private destinationPosition: Coordinates|null = null;
    private isShipMoving: boolean = false;


    private controls: UserControls;
    private cannon: Cannon;
    private shipHull: ShipHealthState;
    private items: ItemType[] = [];

    constructor(game: GameEngine, id: string, controls: UserControls, shipType: ShipType = 'standard') {
        super(game);
        this.position = getRandomFreePosition(getIslandPositions(game.layers));

        this.shipHull = new ShipHealthState(game, shipType)

        this.id = id;
        this.controls = controls;

        this.cannon = new Cannon(game, GAME_CONFIG.DEFAULT_CANON_POWER, GAME_CONFIG.DEFAULT_SHIP_CANON_DISTANCE)

    }

    draw() {
        rotateElementInGrid(this.game.ctx, this.direction, this.position, (shipCords) => {
            drawImageInGrid(this.game.ctx, this.shipHull.shipImage, shipCords);
        })

        this.cannon.draw(this.position);
        this.shipHull.draw(this.position, this.health, this.maxHealth);
    }

    update() {
        this.handleShipDead();
        this.handleUserInput();
        this.stopAnimatingShipOnDestination();
        this.animateShipToDestination();
        this.pickupItem();

        this.shipHull.update(this.health, this.maxHealth);
        this.cannon.update();


    }

    public takeDamage(canonBall: Canonball) {
        this.health = this.health - canonBall.power;
    }

    private handleUserInput() {
        if (this.isDisposed || this.isDead) {
            return;
        }
        this.handleUserMovement();
        this.handleUserShoot();
    }

    private handleUserShoot() {
        if (this.controls.shootLeft && !this.isShipMoving && !this.cannon.isOnCooldown) {
           this.cannon.shootLeft(this.position, this.direction);
        }

        if (this.controls.shootRight && !this.isShipMoving && !this.cannon.isOnCooldown) {
           this.cannon.shootRight(this.position, this.direction)
        }
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

    private pickupItem() {
        this.game.layers.items.forEach(item => {
            if (arePointsTheSame(this.position, item.position)) {
                this.items.push(item);
                item.isDisposed = true;
            }
        });

    }



}