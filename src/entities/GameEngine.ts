import { Layers } from "../types/Layers";
import { Entity } from "./Entity";
import { GAME_CONFIG } from "../constants/GameConfig";
import { gridToPx, pxToGrid } from "../utils/gridToPx";
import { UserControls } from "../types/UserControls";


export interface GameControls {
    player1: UserControls;
    player2: UserControls;
}

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
        switch (ev.code) {
            case "ArrowLeft":
                player1.left = true;
                break;
            case "KeyA":
                player2.left = true;
                break;
            case "ArrowRight":
                player1.right = true;
                break;
            case "KeyD":
                player2.right = true;
                break;
            case "ArrowUp":
                player1.up = true;
                break;
            case "KeyW":
                player2.up = true;
                break;
            case "ArrowDown":
                player1.down = true;
                break;
            case "KeyS":
                player2.down = true;
                break;
            case "Slash":
                player1.shootRight = true;
                break;
            case "Period":
                player1.shootLeft = true;
                break;
        }
        this.debug.pressedKey = ev.code;
        this.debug.player1Controls = this.controls.player1;
        this.debug.player2Controls = this.controls.player2;
    }

    private onKeyUp(ev: KeyboardEvent) {
        const { player1, player2 } = this.controls;
        switch (ev.code) {
            case "ArrowLeft":
                player1.left = false;
                break;
            case "KeyA":
                player2.left = false;
                break;
            case "ArrowRight":
                player1.right = false;
                break;
            case "KeyD":
                player2.right = false;
                break;
            case "ArrowUp":
                player1.up = false;
                break;
            case "KeyW":
                player2.up = false;
                break;
            case "ArrowDown":
                player1.down = false;
                break;
            case "KeyS":
                player2.down = false;
                break;
            case "Slash":
                player1.shootRight = false;
                break;
            case "Period":
                player1.shootLeft = false;
                break;
        }
    }

    private update() {
        this.ticks++;
        this.debug.ticks = this.ticks;

        this.entities = this.entities.filter(entity => !entity.isDisposed);

        this.entities.forEach(entity => {
            entity.update();
        })
    }

    private draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.save();



        this.entities.forEach((entity) => {
            entity.draw();
        })

        if (GAME_CONFIG.DEBUG) {
            Object.entries(this.debug).forEach(([key, value], index) => {
                this.ctx.font = "10px Arial"
                this.ctx.fillStyle = '#000000'
                this.ctx.fillText(`${key}: ${JSON.stringify(value)}`, 0, 10 * index + 10);
            })
        }
    }


}