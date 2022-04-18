export class Board {
    y : number;
    x : number;
    curBoard : string[][];

    constructor () {
        this.y = 20;
        this.x = 10;
        this.fillBoard();



    }

    fillBoard() {
        this.curBoard
    }
}


export class Piece {

    static tetriminoes : {
        [key: string]: any,
        readonly empty: string;
    } = {
        empty: '-'
    };
}