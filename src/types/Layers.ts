import { Canonball } from "../entities/Canonball";
import { Ship } from "../entities/Ship";
import { Island } from "../entities/Island";


export interface Layers {
    islands: Island[],
    ships: Ship[];
    canonballs: Canonball[];
}