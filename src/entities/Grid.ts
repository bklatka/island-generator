import { Entity } from "./Entity";
import { GameEngine } from "./GameEngine";
import { drawGameGrid } from "../painters/drawGameGrid";


export class Grid extends Entity {


    constructor(game: GameEngine) {
        super(game);
    }

    draw() {
        drawGameGrid(this.game.ctx);
    }

}