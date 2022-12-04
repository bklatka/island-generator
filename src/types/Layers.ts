import { Canonball } from "../entities/Canonball";
import { Ship } from "../entities/ship/Ship";
import { Island } from "../entities/Island";
import { ItemType } from "./ItemType";
import { Item } from "../entities/items/Item";
import { DrawnParts } from "./DrawBlock";


export interface Layers {
    islands: DrawnParts[][],
    ships: Ship[];
    canonballs: Canonball[];
    items: Item[];
}