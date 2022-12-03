import { Layers } from "../types/Layers";
import { Entity } from "./Entity";
import { GAME_CONFIG } from "../constants/GameConfig";
import { pxToGrid } from "../utils/gridToPx";
import { UserControls } from "../types/UserControls";
import { Ship } from "./ship/Ship";
import { Island } from "./Island";
import { Canonball } from "./Canonball";
import { Item } from "./items/Item";


export interface GameControls {
    player1: UserControls;
    player2: UserControls;
}

const KEY_BINDINGS = {
    player1: {
        up: "ArrowUp",
        down: "ArrowDown",
        left: "ArrowLeft",
        right: "ArrowRight",
        shootLeft: "Period",
        shootRight: "Slash",
    },
    player2: {
        up: "KeyW",
        down: "KeyS",
        left: "KeyA",
        right: "KeyD",
        shootLeft: "KeyQ",
        shootRight: "KeyE",
    }
}

export type GameState = 'start' | 'end'
export class GameEngine {
    public ctx: CanvasRenderingContext2D;
    public layers: Layers;
    public entities: Entity[] = [];
    public ticks: number = 0;
    public debug: any = {
        debug: 'on'
    };
    public controls: GameControls = {
        player1: {
            left: false,
            down: false,
            right: false,
            up: false,
            shootLeft: false,
            shootRight: false,
        },
        player2: {
            left: false,
            down: false,
            right: false,
            up: false,
            shootLeft: false,
            shootRight: false,
        }
    };
    public gameState: GameState = 'start';

    constructor(ctx: CanvasRenderingContext2D, layers: Layers) {
        this.ctx = ctx;
        this.layers = layers;
    }

    public init() {
        this.listenForInputs();
        this.gameLoop();
    }

    public addEntity(entity: Entity) {
        this.entities.push(entity);
    }

    public addShip(ship: Ship) {
        this.addEntity(ship);
        this.layers.ships.push(ship);
    }

    public addIsland(island: Island) {
        this.addEntity(island);
        this.layers.islands.push(island);
    }

    public addCanonball(canonball: Canonball) {
        this.addEntity(canonball);
        this.layers.canonballs.push(canonball);
    }

    public addItem(item: Item) {
        this.addEntity(item);
        this.layers.items.push(item);
    }


    private gameLoop() {
        this.update();
        this.draw();

        requestAnimationFrame(this.gameLoop.bind(this))
    }

    private listenForInputs() {
        document.addEventListener('keydown', this.onKeyDown.bind(this), false)
        document.addEventListener('keyup', this.onKeyUp.bind(this), false)
        this.ctx.canvas.addEventListener('mousemove', ev => {

            const mouseGridPosition = pxToGrid(this.ctx,ev.offsetX, ev.offsetY)
            this.debug.mouse = mouseGridPosition;
        })
    }

    private onKeyDown(ev: KeyboardEvent) {
        const { player1, player2 } = this.controls;

        const player1Controls = Object.entries(KEY_BINDINGS.player1);
        const player2Controls = Object.entries(KEY_BINDINGS.player2);

        const player1Action = player1Controls.find(([action, key]) => key === ev.code);
        const player2Action = player2Controls.find(([action, key]) => key === ev.code);

        if (player1Action) {
            const [action] = player1Action;
            player1[action as keyof UserControls] = true;
        }

        if (player2Action) {
            const [action] = player2Action;
            player2[action as keyof UserControls] = true;
        }
        this.debug.pressedKey = ev.code;
        this.debug.player1Controls = this.controls.player1;
        this.debug.player2Controls = this.controls.player2;
    }

    private onKeyUp(ev: KeyboardEvent) {
        const { player1, player2 } = this.controls;

        const player1Controls = Object.entries(KEY_BINDINGS.player1);
        const player2Controls = Object.entries(KEY_BINDINGS.player2);

        const player1Action = player1Controls.find(([action, key]) => key === ev.code);
        const player2Action = player2Controls.find(([action, key]) => key === ev.code);

        if (player1Action) {
            const [action] = player1Action;
            player1[action as keyof UserControls] = false;
        }

        if (player2Action) {
            const [action] = player2Action;
            player2[action as keyof UserControls] = false;
        }
    }

    private update() {
        this.ticks++;
        this.debug.ticks = this.ticks;

        this.entities = this.entities.filter(entity => !entity.isDisposed);
        this.layers.items = this.layers.items.filter(item => !item.isDisposed);

        this.layers.canonballs = this.layers.canonballs.filter(c => !c.isDisposed);

        this.entities.forEach(entity => {
            entity.update();
        })

        this.checkIfRoundIsWon();
    }

    private draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.save();

        this.entities.forEach((entity) => {
            entity.draw();
        })

        if (GAME_CONFIG.DEBUG) {
            this.drawDebug();
        }
    }

    private drawDebug() {
        Object.entries(this.debug).forEach(([key, value], index) => {
            this.ctx.font = "10px Arial"
            this.ctx.fillStyle = '#000000'
            this.ctx.fillText(`${key}: ${JSON.stringify(value)}`, 0, 10 * index + 10);
        })
    }

    private checkIfRoundIsWon() {
        const { ships } = this.layers;
        const destroyedShips = ships.filter(ship => ship.isDisposed);
        this.debug.gameState = this.gameState;

        if (destroyedShips.length === 1) {
            this.gameState = 'end';
            document?.getElementById('App')?.classList.add('finished')
        }

    }


}