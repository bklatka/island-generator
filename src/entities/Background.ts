import { Entity } from "./Entity";
import { GameEngine } from "./GameEngine";
import { drawBackground } from "../painters/drawBackground";


export class Background extends Entity {
    constructor(game: GameEngine) {
        super(game);
    }

    draw() {
        drawBackground(this.game.ctx)
    }
}