export class Piece {

    static tetriminoes = {
        /* 
        *   a drawing represents all rotations possible 
        *   1st rotation being A 2nd being B ....
        */
        names: ['I', 'T', 'S', 'Z', 'J', 'L', 'O'],
        rotKeys : ['up', 'right', 'down', 'left'],
        indestructible : 'X',
        empty: '-',
        new: '+',
        /* ==== */
        I: {
            drawing : [
                ['-', 'A', 'C', '-'],
                ['B', 'BA', 'CB', 'B'],
                ['D', 'DA', 'CD', 'D'],
                ['-', 'A', 'C', '-']
            ],
        },
         /*   =    */
        /*   ===     */
        T : {
            drawing : [
                ['-', 'ABD ', '-'],
                ['ADC', 'ABCD ', 'ACB'],
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

    static rotIter = class {

        constructor() {
            this.names = [...Piece.tetriminoes.rotKeys];
            this.i = 0;
        }

        next() {
            if (this.i >= Piece.tetriminoes.rotKeys.length - 1)
                this.i = 0;
            else
                this.i++;
            return (this.names[this.i]);
        }
    };

    static randIt = new Piece.randIter();
    static rotIt = new Piece.rotIter();

    constructor (letter) {

        this.staticRef = Piece.tetriminoes;
        this.rotLetters = ['A', 'B', 'C', 'D'];
        this.rotKeys = Piece.tetriminoes.rotKeys;
        this.curRotation = Piece.tetriminoes.rotKeys[0];

        if (letter)
            this.name = letter;
        else
            this.name = Piece.randIt.next();
            // this.name = this.randomPiece();
        this.offsets = this.calcOffsetsFromDrawing();
    }

    rotate() {
        this.curRotation = Piece.rotIt.next();
    }

    randomPiece() {
        const keys = Object.keys(this.staticRef.names);
        const rkey = keys[ keys.length * Math.random() << 0];
        return rkey;
    }

     /* search for cords from drawing of tetriminos, find center of drawing for playerPos to apply offsets from*/
    calcOffsetsFromDrawing() {
        let rots = {};
        for (let i = 0; i < this.rotLetters.length; i++) {
           rots[this.rotKeys[i]] = this.calcOffsetsFromLetter(this.rotLetters[i]);
        }
        return rots;
    }

    calcOffsetsFromLetter(rotLetter) {
        /* 
            calc from center : 
                adv: when rotating, piece seems to rotate with one center piece still 
                dis: cant place precisly placing I at y0x0 will have center at y0x0 cause the top to be outside -2
            from top : 
                opposite
                each cor in each rot must start with y x 0 0
        */
        const offsets = 
                    [{y:-1, x:-1}, {y:-1, x:-1}, {y:-1, x:-1}, {y:-1, x:-1}];

        const drawing = this.staticRef[this.name].drawing; 

        //const startY = -(Math.trunc(drawing.length / 2)); //center   
        //const startX = -(Math.trunc(drawing[0].length / 2)); //center

        /*let startX;
        let startY;

        //search for head 
        
            for (let x = 0; x < drawing[y].length; x++)
                if (drawing[y][x].includes(rotLetter)) {
                    startX = -x;
                    startY = -y;
                    break;
                }

        let i = 0;
        let y = startY;
        let x;*/

        let top = {y: null , x: null};
        let i = 0;
        for (let y = 0; y < drawing.length; y++) {
            for (let x = 0; x < drawing[y].length; x++) {
                if (drawing[y][x].includes(rotLetter)) {
                    if (top.y === null) {
                        top.y = -y;
                        top.x = -x;
                    }
                    offsets[i].y = y + top.y;
                    offsets[i].x = x + top.x;
                    i++;
                }
            }
        }
        
        return offsets;
    }
}