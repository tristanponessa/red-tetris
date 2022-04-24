import { Piece } from './Piece';

export class Board {

    constructor(pieceLetter) {
        this.y = 20;
        this.x = 10;
        this.startPos = {y: 0, x: Math.trunc(this.x / 2)} // in case we wanna change x to ex.11 in the futur, remove fractional part
        this.invisibleZoneRangeMaxY = 4; //cause the longest piece I is height 4
        this.curBoard = this.newBoard();
        this.curPiece = new Piece(pieceLetter === undefined ? null : pieceLetter);
        this.playerPos = {...this.startPos};
    }

    newBoard() {
        return Array.from(Array(this.y), 
                    () => new Array(this.x).fill(Piece.tetriminoes.empty));
    }

    placeCurPiece(pos) {

        let r = {state: true, cords: null};

        const prev
        this.playerPos = pos;

        

    }

    /*dropNewPiece(pieceLetter) {
        this.curPiece = new Piece(pieceLetter === undefined ? undefined : pieceLetter);
    }*/
}


