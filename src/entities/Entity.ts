import { GameEngine } from "./GameEngine";


export class Entity {
    protected game: GameEngine;

    constructor(game: GameEngine) {
        this.game = game;
    }

    draw(): void {

    }

    update(): void {

    }
}