import { Entity } from "../Entity";
import { GameEngine } from "../GameEngine";
import { Coordinates } from "../../types/Coordinates";
import { ItemEffect, ItemName, ItemType } from "../../types/ItemType";
import DistanceUp from '../../assets/items/distanceUp.png';
import PowerUp from '../../assets/items/powerUp.png';
import SpeedUp from '../../assets/items/speedUp.png';
import { drawImageInGrid } from "../../painters/drawImageInGrid";


const ITEMS: Record<ItemName, ItemType> = {
    shipSpeedUp: {
        name: 'shipSpeedUp',
        effect: [{ speed: 1 }]
    },
    canonPowerUp: {
        name: 'canonPowerUp',
        effect: [{ power: 10 }]
    },
    canonDistanceUp: {
        name: 'canonDistanceUp',
        effect: [{ shootDistance: 1 }]
    }

};

const ItemImages: Record<ItemName, string> = {
    canonDistanceUp: DistanceUp,
    canonPowerUp: PowerUp,
    shipSpeedUp: SpeedUp,
}

export class Item extends Entity {

    public name: ItemName;
    public effect: ItemEffect[];
    public position: Coordinates;
    private image: HTMLImageElement;

    constructor(game: GameEngine, position: Coordinates, type: ItemName) {
        super(game);

        this.name = type;
        this.effect = ITEMS[type].effect;
        this.position = position;

        this.image = new Image();
        this.image.src = ItemImages[type];
    }

    draw() {
        drawImageInGrid(this.game.ctx, this.image, this.position, 0.75, true)
    }
}