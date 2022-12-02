import { Entity } from "./Entity";
import { GameEngine } from "./GameEngine";
import { Coordinates } from "../types/Coordinates";
import CanonballImage from '../assets/misc/cannonBall.png';
import { drawImageInGrid } from "../painters/drawImageInGrid";
import { Directions } from "../types/Directions";
import { times } from "lodash-es";
import { moveByDirection } from "../utils/movePointByDirection";
import { arePointsTheSame } from "../utils/arePointsTheSame";

export class Canonball extends Entity {
    id: string;
    power: number;
    position: Coordinates;
    isDisposed: boolean = false;
    direction: Directions;

    private destination: Coordinates;

    private canonballImage: HTMLImageElement;


    constructor(game: GameEngine, id: string, startPosition: Coordinates, direction: Directions, power: number, distance: number) {
        super(game);

        this.direction = direction;
        this.id = id;
        this.position = startPosition;
        this.power = power;

        this.destination = moveByDirection(startPosition, direction);
        times(distance, () => {
            this.destination = moveByDirection(this.destination, direction);
        });

        this.canonballImage = new Image()
        this.canonballImage.src = CanonballImage;
    }

    update() {
        if (this.game.ticks % 5 === 0) {
            this.position = moveByDirection(this.position, this.direction)
        }

        if (arePointsTheSame(this.position, this.destination)) {
            this.isDisposed = true;
        }
    }

    draw() {
        drawImageInGrid(this.game.ctx, this.canonballImage, this.position, 0.25);
    }
}