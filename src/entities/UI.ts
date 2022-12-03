import { Entity } from "./Entity";
import { GameEngine } from "./GameEngine";
import ShipUi from '../assets/ui/UIShip.png';
import EmptyBar from '../assets/ui/uiProgressBlock.png';
import HealthBar from '../assets/ui/uiHealthBar.png';
import HealthBarEnd from '../assets/ui/healthEnd.png';
import { times } from "lodash-es";
import { loadImage } from "../utils/loadImage";
import superWeaponSlot from '../assets/ui/superweaponslot.png'
import { Ship } from "./ship/Ship";

const HEALTH_LENGTH = 10;

const RULER = {
    baseUI: {
        width: 84,
        height: 64
    },
    bar: {
        width: 8,
        height: 16,
    },
    barSpace: 0,
}

export class UI extends Entity {
    private baseUI: HTMLImageElement;
    private emptyBar: HTMLImageElement;
    private healthBar: HTMLImageElement;
    private healthBarEnd: HTMLImageElement;
    private superWeaponSlot: HTMLImageElement;

    constructor(game: GameEngine) {
        super(game);

        this.baseUI = loadImage(ShipUi);
        this.emptyBar = loadImage(EmptyBar);

        this.healthBar = loadImage(HealthBar);

        this.healthBarEnd = loadImage(HealthBarEnd);

        this.healthBarEnd = loadImage(HealthBarEnd);
        this.superWeaponSlot = loadImage(superWeaponSlot);
    }

    update() {

    }

    draw() {
        const { ctx } = this.game;

        const player1Ship = this.game.layers.ships.find(ship => ship.id === 'player1')
        const player2Ship = this.game.layers.ships.find(ship => ship.id === 'player2')

        if (player1Ship) {
            this.drawPlayerUi(player1Ship);
        }

        if (player2Ship) {
            ctx.save();
            ctx.translate(ctx.canvas.width - 200, 0);
            this.drawPlayerUi(player2Ship);
            ctx.restore();
        }
    }

    private drawPlayerUi(playerShip: Ship) {
        this.drawBaseUi();
        this.drawHealthBarsEmpty();
        this.drawSuperWeaponSlot();
        this.drawHealthBarFill(playerShip.health/playerShip.maxHealth * 100);
        this.drawShipAvatar(playerShip.shipHull.shipImage);
    }

    private drawBaseUi() {
        const { ctx } = this.game;

        ctx.drawImage(this.baseUI, 0, 0);
    }


    private drawHealthBarsEmpty() {
        const { ctx } = this.game;

        times(HEALTH_LENGTH, (index) => {
            ctx.drawImage(this.emptyBar, this.calculateHealthBarPosition(index), 4);
        });

        ctx.drawImage(
            this.healthBarEnd,
            this.calculateHealthBarPosition(HEALTH_LENGTH),
            2
            )
    }

    private drawHealthBarFill(healthPercentage: number) {
        const { ctx } = this.game;

        const fullBars = healthPercentage / HEALTH_LENGTH;
        this.game.debug.health = fullBars;

        times(fullBars, (index) => {
            ctx.drawImage(this.healthBar, this.calculateHealthBarPosition(index), 4);
        });
    }

    private calculateHealthBarPosition(barIndex: number) {
        return RULER.baseUI.width + RULER.barSpace + RULER.bar.width * barIndex + RULER.barSpace * barIndex;
    }

    private drawShipAvatar(avatar: HTMLImageElement) {
        const scale = 0.3;
        this.game.ctx.drawImage(avatar, 22, 15, avatar.width * scale, avatar.height * scale);
    }

    private drawSuperWeaponSlot() {
        this.game.ctx.drawImage(
            this.superWeaponSlot,
            RULER.baseUI.width - 13,
            RULER.bar.height + 6,
            )
    }
}