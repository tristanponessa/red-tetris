import { Piece } from './Piece';

export class Board {

    y : number;
    x : number;
    curBoard : string[][];

    constructor() {
        this.y = 20;
        this.x = 10;
        this.curBoard = this.newBoard();
    }

    newBoard() : string[][] {
        return Array.from(Array(this.y), 
                    () => new Array(this.x).fill(Piece.tetriminoes.empty));
    } 
}


