import { Canonball } from "../entities/Canonball";
import { Ship } from "../entities/ship/Ship";
import { Island } from "../entities/Island";
import { ItemType } from "./ItemType";
import { Item } from "../entities/items/Item";


export interface Layers {
    islands: Island[],
    ships: Ship[];
    canonballs: Canonball[];
    items: Item[];
}