import { Layers } from "../types/Layers";
import { Entity } from "./Entity";


export interface GameControls {
    player: {
        left: boolean;
        right: boolean;
        up: boolean;
        down: boolean;
    }
}

export class GameEngine {
    public ctx: CanvasRenderingContext2D;
    public layers: Layers;
    public entities: Entity[] = [];
    public ticks: number = 0;
    public controls: GameControls = {
        player: {
            left: false,
            down: false,
            right: false,
            up: false,
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
        this.ctx.canvas.addEventListener('keydown', this.onKeyDown)
        this.ctx.canvas.addEventListener('keyup', this.onKeyUp)
    }

    private onKeyDown(ev: KeyboardEvent) {
        switch (ev.code) {
            case "ArrowLeft":
            case "KeyA":
                this.controls.player.left = true;
                break;
            case "ArrowRight":
            case "KeyD":
                this.controls.player.right = true;
                break;
            case "ArrowUp":
            case "KeyW":
                this.controls.player.up = true;
                break;
            case "ArrowDown":
            case "KeyS":
                this.controls.player.down = true;
                break;
        }
    }

    private onKeyUp(ev: KeyboardEvent) {
        switch (ev.code) {
            case "ArrowLeft":
            case "KeyA":
                this.controls.player.left = false;
                break;
            case "ArrowRight":
            case "KeyD":
                this.controls.player.right = false;
                break;
            case "ArrowUp":
            case "KeyW":
                this.controls.player.up = false;
                break;
            case "ArrowDown":
            case "KeyS":
                this.controls.player.down = false;
                break;
        }
    }

    private update() {
        this.ticks++;

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
    }


}