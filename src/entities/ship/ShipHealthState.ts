import { Entity } from "../Entity";
import { GameEngine } from "../GameEngine";
import Ship1 from "../../assets/ships/ship1/good.png";
import Ship1Hit from "../../assets/ships/ship1/hit.png";
import Ship1Bad from "../../assets/ships/ship1/bad.png";
import Ship1Dead from "../../assets/ships/ship1/dead.png";
import Ship2 from "../../assets/ships/ship2/good.png";
import Ship2Hit from "../../assets/ships/ship2/hit.png";
import Ship2Bad from "../../assets/ships/ship2/bad.png";
import Ship2Dead from "../../assets/ships/ship2/dead.png";
import { ShipHealthStateType, ShipType } from "../../types/Ship";


const SHIP_MAP: Record<ShipType, Record<ShipHealthStateType, string>> = {
    standard: { good: Ship1, hit: Ship1Hit, bad: Ship1Bad, dead: Ship1Dead },
    pirate: { good: Ship2, hit: Ship2Hit, bad: Ship2Bad, dead: Ship2Dead },
}

export class ShipHealthState extends Entity {

    public shipImage: HTMLImageElement;
    public shipHealthState: ShipHealthStateType = 'good';

    private shipGraphics: Record<ShipHealthStateType, HTMLImageElement>;


    constructor(game: GameEngine, shipType: ShipType) {
        super(game);

        const shipImages = SHIP_MAP[shipType];
        this.shipGraphics = {
            good: new Image(),
            hit: new Image(),
            bad: new Image(),
            dead: new Image(),
        }
        this.shipGraphics.good.src = shipImages.good
        this.shipGraphics.hit.src = shipImages.hit
        this.shipGraphics.bad.src = shipImages.bad
        this.shipGraphics.dead.src = shipImages.dead;

        this.shipImage = this.shipGraphics.good;
    }

    update(health: number, maxHealth: number) {
        this.calculateShipState(health, maxHealth);
        this.chooseCorrectShipImage();
    }

    private calculateShipState(health: number, maxHealth: number) {
        const healthPercentage = health / maxHealth * 100;
        if (healthPercentage >= 70) {
            this.shipHealthState = 'good';
        } else if (healthPercentage >= 40) {
            this.shipHealthState = 'hit';
        } else if (healthPercentage >= 20) {
            this.shipHealthState = 'bad';
        } else if (healthPercentage <= 0) {
            this.shipHealthState = 'dead'
        }
    }

    private chooseCorrectShipImage() {
        this.shipImage = this.shipGraphics[this.shipHealthState];
    }
}