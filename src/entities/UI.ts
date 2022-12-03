import { Entity } from "./Entity";
import { GameEngine } from "./GameEngine";
import ShipUi from '../assets/ui/UIShip.png';
import EmptyBar from '../assets/ui/uiProgressBlock.png';
import HealthBar from '../assets/ui/uiHealthBar.png';
import HealthBarEnd from '../assets/ui/healthEnd.png';
import { times } from "lodash-es";


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

    constructor(game: GameEngine) {
        super(game);

        this.baseUI = new Image();
        this.baseUI.src = ShipUi;

        this.emptyBar = new Image();
        this.emptyBar.src = EmptyBar;

        this.healthBar = new Image();
        this.healthBar.src = HealthBar;

        this.healthBarEnd = new Image();
        this.healthBarEnd.src = HealthBarEnd;
    }

    update() {

    }

    draw() {
        this.drawPlayer1Ui();
        this.drawPlayer2Ui();
    }

    private drawPlayer2Ui() {
        const { ctx } = this.game;

        const player2Ship = this.game.layers.ships.find(ship => ship.id === 'player2')


        if (!player2Ship) {
            return;
        }

        ctx.save();
        ctx.translate(ctx.canvas.width - 200, 0);
        this.drawBaseUi();
        this.drawHealthBarsEmpty();
        this.drawHealthBarFill(player2Ship.health/player2Ship.maxHealth * 100);
        this.drawShipAvatar(player2Ship.shipHull.shipImage);
        ctx.restore();
    }

    private drawPlayer1Ui() {
        const player1Ship = this.game.layers.ships.find(ship => ship.id === 'player1')

        if (!player1Ship) {
            return;
        }

        this.drawBaseUi();
        this.drawHealthBarsEmpty();
        this.drawHealthBarFill(player1Ship.health/player1Ship.maxHealth * 100);
        this.drawShipAvatar(player1Ship.shipHull.shipImage);
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
}