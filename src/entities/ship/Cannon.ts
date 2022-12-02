import { Entity } from "../Entity";
import { GameEngine } from "../GameEngine";
import { Directions } from "../../types/Directions";
import { Canonball } from "../Canonball";
import { moveByDirection } from "../../utils/movePointByDirection";
import { Coordinates } from "../../types/Coordinates";
import { GAME_RESOLUTION } from "../../painters/drawGameGrid";
import { gridToPx } from "../../utils/gridToPx";


export class Cannon extends Entity {

    private power: number;
    private shootDistance: number;

    public isOnCooldown: boolean = false;
    private cooldownTime: number = 100;
    private cooldownStart: number = 0;

    constructor(
        game: GameEngine,
        power: number,
        shootDistance: number,
    ) {
        super(game);
        this.power = power;
        this.shootDistance = shootDistance;
    }

    draw(shipPosition: Coordinates) {
        if (this.isOnCooldown) {
            this.drawCooldownBar(shipPosition);
        }
    }

    update() {
        this.countCannonCooldown();
    }

    public shootLeft(shipPosition: Coordinates, direction: Directions) {
        if (this.isOnCooldown) {
            return;
        }

        const shipDirectionToBallDirection: Record<Directions, Directions> = {
            top: 'left',
            left: 'bottom',
            right: 'top',
            bottom: 'right',
        }

        const ballDirection = shipDirectionToBallDirection[direction];
        this.shootBall(shipPosition, ballDirection)
    }


    public increaseDistance(value: number) {
        this.shootDistance += value;
    }

    public increasePower(value: number) {
        this.power += value;
    }

    public shootRight(shipPosition: Coordinates, direction: Directions) {
        const shipDirectionToBallDirection: Record<Directions, Directions> = {
            top: 'right',
            left: 'top',
            right: 'bottom',
            bottom: 'left',
        }

        const ballDirection = shipDirectionToBallDirection[direction];
        this.shootBall(shipPosition, ballDirection)
    }


    private shootBall(position: Coordinates, direction: Directions) {
        this.game.addCanonball(new Canonball(this.game, 'ball', moveByDirection(position, direction), direction, this.power, this.shootDistance))
        this.isOnCooldown = true;

        this.cooldownStart = this.game.ticks;
    }

    private countCannonCooldown() {
        if (this.isOnCooldown && this.cooldownStart + this.cooldownTime < this.game.ticks) {
            this.isOnCooldown = false;
        }
    }

    private drawCooldownBar(shipPosition: Coordinates) {
        const { ctx, ticks } = this.game;
        const cooldownEnd = this.cooldownStart + this.cooldownTime
        const percentDone = (this.cooldownStart - ticks) / (this.cooldownStart - cooldownEnd);

        const maxCooldownWidth = GAME_RESOLUTION.getGridWidth(ctx);

        const [xPos, yPos] = gridToPx(ctx, shipPosition)


        ctx.beginPath();
        ctx.fillStyle = '#ffdd18'
        ctx.rect(xPos, yPos, maxCooldownWidth * percentDone, 5);
        ctx.fill();
    }
}