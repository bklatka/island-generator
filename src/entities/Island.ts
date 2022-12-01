import { Entity } from "./Entity";
import { GameEngine } from "./GameEngine";
import { DrawnParts } from "../types/DrawBlock";
import { getIslandPositions } from "../utils/getIslandPositions";
import { generateRandomIsland } from "../shapeCalculators/generateRandomIsland";
import { TileMap } from "../painters/drawIslandPart";
import { Coordinates } from "../types/Coordinates";
import { drawImageInGrid } from "../painters/drawImageInGrid";


interface DrawingBlocks {
    coord: Coordinates;
    tile: HTMLImageElement;
}
export class Island extends Entity {
    public blocks: DrawnParts[];
    private drawningBlocks

    constructor(game: GameEngine) {
        super(game);
        this.blocks = generateRandomIsland(getIslandPositions(game.layers))

        // preload block images
        this.drawningBlocks = this.blocks.map(block => {
            const image = new Image();
            image.src = TileMap[block.tile]
            return {
                coord: block.coord,
                tile: image,
            }
        })

        game.layers.islands.push(this.blocks);
    }

    draw() {
        this.drawningBlocks.forEach(block => {
            drawImageInGrid(this.game.ctx, block.tile, block.coord);
        })
    }

    update() {}
}