import { Entity } from "./Entity";
import { GameEngine } from "./GameEngine";
import { DrawnParts } from "../types/DrawBlock";
import { getIslandPositions } from "../utils/getIslandPositions";
import { generateRandomIsland } from "../shapeCalculators/generateRandomIsland";
import { TileMap } from "../painters/drawIslandPart";
import { drawImageInGrid } from "../painters/drawImageInGrid";


export class Island extends Entity {
    public blocks: DrawnParts[];
    private drawingBlocks

    constructor(game: GameEngine, shape: DrawnParts[]) {
        super(game);
        // this.blocks = generateRandomIsland(getIslandPositions(game.layers))
        this.blocks = shape;

        // preload block images
        this.drawingBlocks = this.blocks.map(block => {
            const image = new Image();
            image.src = TileMap[block.tile]
            return {
                coord: block.coord,
                tile: image,
            }
        })
    }

    draw() {
        this.drawingBlocks.forEach(block => {
            drawImageInGrid(this.game.ctx, block.tile, block.coord);
        })
    }
}