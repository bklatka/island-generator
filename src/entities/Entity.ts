import { GameEngine } from "./GameEngine";


export class Entity {
    protected game: GameEngine;
    public isDisposed: boolean = false;

    constructor(game: GameEngine) {
        this.game = game;
    }

    draw(): void {

    }

    update(): void {

    }
}