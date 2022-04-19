import { FixedLengthArray } from '../libft/global';

type Coordinate = {y:number, x:number};

type TetriminoRotation = {
    [k : "up" | "down" | "right" | "left"] : FixedLengthArray<Coordinate, 4> //the 4 keys must exist or error 
};

interface Tetrimino {
    [key: string]: any,
    readonly empty: string,
    readonly drawing : string[][],
    offsets? : TetriminoRotation
};


class Tetriminoe {
    empty: '-',
    /* ==== */
    I = [
            ['-', 'D', 'B', '-'],
            ['A', 'AD', 'AB', 'A'],
            ['C', 'CD', 'CB', 'C'],
            ['-', 'D', 'B', '-']
        ]
    


    constructor (letter : string?) {
        this.staticRef = Piece.tetriminoes;
        if (letter)
            this.staticRef. = 
        

    }


 /* search for cords from drawing of tetriminos*/
static calcOffsetsFromDrawing(drawing : string[][], rotrotLetter : string) :  {
    const offsets = [{y:null, x:null}, {y:null, x:null}, {y:null, x:null}, {y:null, x:null}];
    let i = 0;
    for (let y = 0; y < drawing.length; y++) 
        for (let x = 0; x < drawing[y].length; x++) {
            if (rotLetter in drawing[y][x]) {
                offsets[i].y = y;
                offsets[i].x = x;
                i++;
            }
    }
    return offsets;
}

constructor (letter : string?) {
    this.staticRef = Piece.tetriminoes;
    if (letter)
        this.staticRef. = 
    

}


 /* search for cords from drawing of tetriminos*/
static calcOffsetsFromDrawing(drawing : string[][], rotrotLetter : string) :  {
    const offsets = [{y:null, x:null}, {y:null, x:null}, {y:null, x:null}, {y:null, x:null}];
    let i = 0;
    for (let y = 0; y < drawing.length; y++) 
        for (let x = 0; x < drawing[y].length; x++) {
            if (rotLetter in drawing[y][x]) {
                offsets[i].y = y;
                offsets[i].x = x;
                i++;
            }
    }
    return offsets;
}










export class Piece {

    static tetriminoes : Tetrimino = {
        empty: '-',
        /* ==== */
        I: {
            drawing: [
                ['-', 'D', 'B', '-'],
                ['A', 'AD', 'AB', 'A'],
                ['C', 'CD', 'CB', 'C'],
                ['-', 'D', 'B', '-']
            ],
            offsets: null /* calc in constr. */
        }
    };

    staticRef : Tetrimino;

    constructor (letter : string?) {
        this.staticRef = Piece.tetriminoes;
        if (letter)
            this.staticRef. = 
        

    }


     /* search for cords from drawing of tetriminos*/
    static calcOffsetsFromDrawing(drawing : string[][], rotrotLetter : string) :  {
        const offsets = [{y:null, x:null}, {y:null, x:null}, {y:null, x:null}, {y:null, x:null}];
        let i = 0;
        for (let y = 0; y < drawing.length; y++) 
            for (let x = 0; x < drawing[y].length; x++) {
                if (rotLetter in drawing[y][x]) {
                    offsets[i].y = y;
                    offsets[i].x = x;
                    i++;
                }
        }
        return offsets;
    }
}