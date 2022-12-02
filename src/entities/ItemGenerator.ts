import { Entity } from "./Entity";
import { getRandomFreePosition } from "../shapeCalculators/getRandomFreePosition";
import { getIslandPositions } from "../utils/getIslandPositions";
import { ItemName } from "../types/ItemType";
import { getRandomFromArray } from "../utils/getRandomFromArray";
import { Item } from "./items/Item";
import { GAME_CONFIG } from "../constants/GameConfig";


const ITEM_GENERATE_DELAY = GAME_CONFIG.ITEM_GENERATION_INTERVAL;

const ITEMS_LIST: ItemName[] = ['shipSpeedUp', 'canonPowerUp', 'canonDistanceUp']
export class ItemGenerator extends Entity {
    update() {
        this.game.debug.items = this.game.layers.items.map(item => item.name);
        if (this.game.ticks % ITEM_GENERATE_DELAY === 0) {
                this.generateItem();
        }
    }


    private generateItem() {
        const position = getRandomFreePosition(getIslandPositions(this.game.layers));
        const itemName = getRandomFromArray(ITEMS_LIST);

        this.game.addItem(new Item(this.game, position, itemName));
    }
}