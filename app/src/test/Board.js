import { Piece } from './Piece';

export class Board {

    constructor() {
        this.y = 20;
        this.x = 10;
        this.curBoard = this.newBoard();
    }

    newBoard() {
        return Array.from(Array(this.y), 
                    () => new Array(this.x).fill(Piece.tetriminoes.empty));
    } 
}


