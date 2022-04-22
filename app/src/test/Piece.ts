import { FixedLengthArray } from '../libft/global';

type Coordinate = {y:number, x:number};

type TetriminoRotations = Record<"up" | "down" | "right" | "left", FixedLengthArray<Coordinate, 4>>;

type TetriminoMap = {
    [key: string]: Tetrimino | string | string[]
};

interface Tetrimino {
    readonly drawing : string[][],
};

export class Piece {

    static tetriminoes : TetriminoMap = {
        /* 
        *   a drawing represents all rotations possible 
        *   1st rotation being A 2nd being B ....
        */
        names: ['I', 'T', 'S', 'Z', 'J', 'L', 'O'],
        indestructible : 'X',
        empty: '-',
        new: '+',
        /* ==== */
        I: {
            drawing : [
                ['-', 'D', 'B', '-'],
                ['A', 'AD', 'AB', 'A'],
                ['C', 'CD', 'CB', 'C'],
                ['-', 'D', 'B', '-']
            ],
        },
         /*    =    */
        /*   ===     */
        T : {
            drawing : [
                ['-', 'ABC ', '-'],
                ['ABD', 'ABCD ', 'ACD'],
                ['-', 'BCD', '-'],
            ]
        },
        /*    ==    */
        /*   ==     */
        S: {
            drawing : [
                ['D','AB','A'],
                ['AD','ABCD','CB'],
                ['C','CD','B']
            ]
        }, 
        /*  ==      */
        /*   ==     */
        Z: {
            drawing : [
                ['A','AD','B'],
                ['CD','DCAB','AB'],
                ['D','BC','C']
            ]
        },
        /*   =    */
        /*   ===     */
        J : {
            drawing : [
                ['A','BD','B'],
                ['AC','DABC','CA'],
                ['D','DB','C']
            ]
        },
        /*     =   */
        /*   ===     */
        L : {
            drawing : [
                ['D','DB','A'],
                ['AC','DCBA','CA'],
                ['C','BD','B']
            ]
        },
        /*   ==    */
        /*   ==     */
        O : {
            drawing : [
                ['ABCD', 'ABCD'],
                ['ABCD', 'ABCD']
            ]
        }
    };

    staticRef : TetriminoMap; //at this moment, its set to the cls and not instance
    curPiece : string;
    rotLetters : [string, string, string, string]; //tuple of 4
    rotKeys : [string, string, string, string];
    offsets : TetriminoRotations;

    constructor (letter? : string) {

        this.staticRef = Piece.tetriminoes;
        this.rotLetters = ['A', 'B', 'C', 'D'];
        this.rotKeys = ['up', 'right', 'down', 'left'];

        if (letter)
            this.curPiece = letter;
        else
            this.curPiece = '';
            // this.curPiece = this.randomPiece();
        this.offsets = this.calcOffsetsFromDrawing();
    }

    randomPiece() : string {
        const keys = Object.keys(this.staticRef.names);
        const rkey = keys[ keys.length * Math.random() << 0];
        return rkey;
    }

     /* search for cords from drawing of tetriminos*/
    calcOffsetsFromDrawing() : TetriminoRotations {
        const rot : Record<string, FixedLengthArray<Coordinate, 4>> = {}; //we dynamicly build the obj up to a TetrimoRot 
        let rots : TetriminoRotations;
        for (let i = 0; i < this.rotLetters.length; i++) {
           rot[this.rotKeys[i]] = this.calcOffsetsFromLetter(this.rotLetters[i]);
        }
        rots = rot;
        return rots;
    }

    calcOffsetsFromLetter(rotLetter : string) : FixedLengthArray<Coordinate, 4> {
        
        const offsets : FixedLengthArray<Coordinate, 4> = 
                    [{y:-1, x:-1}, {y:-1, x:-1}, {y:-1, x:-1}, {y:-1, x:-1}];
        //parent type passed   string|string[]|Tetrimino , when accessing drawing, results in error as drawing is Tetrimino, not the entire union
        const drawing = (this.staticRef[this.curPiece] as Tetrimino).drawing ; 

        let i = 0;
            for (let y = 0; y < drawing.length; y++) {
                for (let x = 0; x < drawing[y].length; x++) {
                    if (drawing[y][x].includes(rotLetter)) {
                        offsets[i].y = y;
                        offsets[i].x = x;
                        i++;
                        
                    }
                }
            }
        
        return offsets;
    }
}