import { Entity } from "./Entity";
import { Island } from "./Island";
import { GameEngine } from "./GameEngine";


export class IslandPainter extends Entity {


    private islands: Island[];

    constructor(game: GameEngine) {
        super(game);

        this.islands = game.layers.islands.map(islandData => new Island(game, islandData))
    }

    draw() {
        this.islands.forEach(island => island.draw());
    }
}