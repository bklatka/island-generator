import { Canonball } from "../entities/Canonball";
import { Ship } from "../entities/ship/Ship";
import { Island } from "../entities/Island";


export interface Layers {
    islands: Island[],
    ships: Ship[];
    canonballs: Canonball[];
}