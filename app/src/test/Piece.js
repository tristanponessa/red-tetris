import { shuffle } from "./utils";

export class Piece {

    static tetriminoes = {
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

    /*static randIter() {
        
        let pieceNames = [];

        const it = {
            next() {
                if (pieceNames.length === 0) 
                    pieceNames = shuffle([...Piece.tetriminoes.names]);
                return (pieceNames.pop());
           }
        };
        return it;
    }*/

    static randIter = class {

        constructor() {
            this.i = 0;
            this.names = [...Piece.tetriminoes.names];
        }

        next() {
            if (this.i === this.names.length - 1) 
                this.i = 0;
            else
                this.i++;
            return (this.names[this.i]);
        }
    };

    static randIt = new Piece.randIter();

    constructor (letter) {

        this.staticRef = Piece.tetriminoes;
        this.rotLetters = ['A', 'B', 'C', 'D'];
        this.rotKeys = ['up', 'right', 'down', 'left'];
        this.curRotation = 'up';

        if (letter)
            this.name = letter;
        else
            this.name = Piece.randIt.next();
            // this.name = this.randomPiece();
        this.offsets = this.calcOffsetsFromDrawing();
    }

    randomPiece() {
        const keys = Object.keys(this.staticRef.names);
        const rkey = keys[ keys.length * Math.random() << 0];
        return rkey;
    }

     /* search for cords from drawing of tetriminos*/
    calcOffsetsFromDrawing() {
        let rots = {};
        for (let i = 0; i < this.rotLetters.length; i++) {
           rots[this.rotKeys[i]] = this.calcOffsetsFromLetter(this.rotLetters[i]);
        }
        return rots;
    }

    calcOffsetsFromLetter(rotLetter) {
        
        const offsets = 
                    [{y:-1, x:-1}, {y:-1, x:-1}, {y:-1, x:-1}, {y:-1, x:-1}];

        const drawing = this.staticRef[this.name].drawing; 

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