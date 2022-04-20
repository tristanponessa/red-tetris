import { FixedLengthArray } from '../libft/global';

type Coordinate = {y:number, x:number};

type TetriminoRotations = {
    [k : "up" | "down" | "right" | "left"] : FixedLengthArray<Coordinate, 4> //the 4 keys must exist or error 
};

interface TetriminoMap {
    [key: string]: Tetrimino | string | string[]
};

interface Tetrimino {
    readonly drawing : string[][],
};

export class Piece {

    static tetriminoes : TetriminoMap = {
        names: ['I', 'T', 'S', 'Z', 'J', 'L', 'O'],
        empty: '-',
        /* ==== */
        I: {
            drawing: [
                ['-', 'D', 'B', '-'],
                ['A', 'AD', 'AB', 'A'],
                ['C', 'CD', 'CB', 'C'],
                ['-', 'D', 'B', '-']
            ],
        }
    };

    staticRef : TetriminoMap; //at this moment, its set to the cls and not instance
    curPiece : string;
    rotLetters : [string, string, string, string];
    rotKeys : [string, string, string, string];
    offsets : TetriminoRotations;

    constructor (letter? : string) {

        this.staticRef = Piece.tetriminoes;
        this.rotLetters = ['A', 'B', 'C', 'D'];
        this.rotKeys = ['up', 'right', 'down', 'left'];

        if (letter)
            this.curPiece = letter;
        else 
            this.curPiece = this.randomPiece();
        this.offsets = this.calcOffsetsFromDrawing();
    }

    randomPiece() : string {
        const keys = Object.keys(this.staticRef.names);
        const rkey = keys[ keys.length * Math.random() << 0];
        return rkey;
    }

     /* search for cords from drawing of tetriminos*/
    calcOffsetsFromDrawing() : TetriminoRotations {
        const rots : any = {};
        for (let i = 0; i < this.rotLetters.length; i++) {
           rots[this.rotKeys[i]] = this.calcOffsetsFromLetter(this.rotLetters[i]);
        }
        return rots;
    }

    calcOffsetsFromLetter(rotLetter : string) : FixedLengthArray<Coordinate, 4> {
        
        const offsets : FixedLengthArray<Coordinate, 4> = [{y:-1, x:-1}, {y:-1, x:-1}, {y:-1, x:-1}, {y:-1, x:-1}];
        const drawing = (this.staticRef[this.curPiece] as Tetrimino).drawing ; //parent type passed any , when accessing drawing, results in error as any.drawing dont exist

        for (let i = 0; i < offsets.length; i++) {
            for (let y = 0; y < drawing.length; y++) {
                for (let x = 0; x < drawing[y].length; x++) {
                    if (rotLetter === drawing[y][x]) {
                        offsets[i].y = y;
                        offsets[i].x = x;
                        
                    }
                }
            }
        }
        return offsets;
    }
}