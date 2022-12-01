import { Entity } from "./Entity";
import { GameEngine } from "./GameEngine";
import { DrawnParts } from "../types/DrawBlock";
import { getIslandPositions } from "../utils/getIslandPositions";
import { drawIsland } from "../painters/drawIsland";
import { generateRandomIsland } from "../shapeCalculators/generateRandomIsland";


export class Island extends Entity {
    public blocks: DrawnParts[];

    constructor(game: GameEngine) {
        super(game);
        this.blocks = generateRandomIsland(getIslandPositions(game.layers))
        game.layers.islands.push(this.blocks);
    }

    draw() {
        drawIsland(this.game.ctx, this.blocks);
    }

    update() {}
}