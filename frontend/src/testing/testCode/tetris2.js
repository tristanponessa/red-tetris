
Player has 
    Board has 
        Pieces 

class Player {
    constructor {
        this.lost = false;
        this.board = new Board();
    }

    runGame() { 
        while (1) {
            if (this.board.looseCondition())
                this.lost = true;
                return ;
        }

    }


}


class Board {

    /*
        '-' nothing there
        'X' indestructible
    */

    static bluePrint = {
        rowN: 20,
        colN: 10
    };

    constructor() {
        this.board = Array.from(Array(20), ()=>new Array(10).fill(Piece.tetriminoes.empty))
        this.blockedRowsStart = Board.bluePrint.rowN;
    }

    *iter(type='col', order='+', startY=0, steps=null) {

        if (order === '+') {
            for (let y = startY; y < Board.bluePrint.rowN; y++) {
                if (type === 'row')
                    yield {y, value:this.board[y]}
                for (let x = 0; x < Board.bluePrint.colN; x++)
                    yield {y, x, value:this.board[y][x]};
            }
        }

        if (order === '-') {
            for (let y = Board.bluePrint.rowN; y > 0; y--) {
                if (type === 'row')
                    yield {y, value:this.board[y]}
                for (let x = Board.bluePrint.colN; x > 0; x--)
                    yield {y, x, value:this.board[y][x]};
            }
        }
    }

    drawMalus(n) {
        //just writes over
        const indestructibleRow = () => new Array(Board.bluePrint.colN).fill(Piece.tetriminoes.indestructible);
        this.blockedRowsStart -= n - 1;
        for (rowRef of this.iter('row', '-', Board.bluePrint.rowN, this.blockedRowsStart))
            rowRef = indestructibleRow(); //if dont get ref , use this.board[row.y] = 
    }


    /* @param {Piece} piece */
    looseCondition(piece) {
        /* if any piece cord is out of bounds */
        /* determined on draw */

        ;

    }   

    draw(piece) {

        testBoard = [...this.board];

        for (cord of piece.curCords) {
            //testBoard[cord.y][cord.x] += piece.name;
            testBoard[cord.y][cord.x] += '+'; //for current
        }

        //check lands
        const obstacles = [];
        for (let y = Board.bluePrint.rowN; y > 0; y--)
            for (let x = 0; x < Board.bluePrint.colN; x++) {
                if (testBoard[y][x].match(new RegExp(`+[${Piece.bluePrint.names}${Piece.bluePrint.indestructible}]{1}`)))
                    obstacles.push({y, x})
            }
        
        if (obstacles.length > 0)
            return obstacles;
        else {
            //clean
            for (cord of piece.curCords) {
                if (testBoard[cord.y][cord.x] === '+-')
                    testBoard[cord.y][cord.x] = piece.name;
            }
            this.board = [...testBoard]; //update
        }
    }
}



class Piece {

    /*
        moves in free will
        its up to board to gen pieces 


    */

    static tetriminoes = {
        rotationKeys : ['horizontal', 'd90', 'vertical', 'd180'],
        names: ['I', 'T', 'S', 'Z', 'J', 'L', 'O'],
        /* ==== */
        I : {
            nickname: 'line',
            start: 0,
            color: 'cyan',
            offsetsDrawing: [
                ['-', 'D', 'B', '-'],
                ['A', 'AD', 'AB', 'A'],
                ['C', 'CD', 'CB', 'C'],
                ['-', 'D', 'B', '-']
            ],
            OffsetsStatic: {
                A:[{y:1, x:0}, {y:1, x:1}, {y:1, x:2}, {y:1, x:3}],
                B:[{y:0, x:2}, {y:1, x:2}, {y:2, x:2}, {y:3, x:2}],
                C:[{y:2, x:0}, {y:2, x:1}, {y:2, x:2}, {y:2, x:3}],
                D:[{y:0, x:1}, {y:1, x:1}, {y:2, x:1}, {y:3, x:1}]
            },
            OffsetsDynamic: {
                get horizantal() { return offsetAuto(this.offsetsDrawing, 'A');},
                get d90()      { return offsetAuto(this.offsetsDrawing, 'B');},
                get vertical() { return offsetAuto(this.offsetsDrawing, 'C');},
                get d180() { return offsetAuto(this.offsetsDrawing, 'D');}
            }
        },

        /*    =    */
        /*   ===     */
        T : null,
        /*    ==    */
        /*   ==     */
        S: null, 
        /*  ==      */
        /*   ==     */
        Z: null,
        /*   =    */
        /*   ===     */
        J : null,
        /*     =   */
        /*   ===     */
        L : null,
        /*   ==    */
        /*   ==     */
        O : null,
        /* XXXXXXXXXX */
        Indestructible : 'X',
        empty: '-'

    }

    constructor() {

    }


    randomPiece() {

    }

    move() {

    }

    draw() {

    }

    rotate() {

    }

    inContact(board) {

    }

    nextRotation() {
        let i = this.rotKeys.findIndex(this.curRotation);
        i++;
        if (i > keys.length - 1)
            i = 0;
        return keys[i];
    }

    /* search for cords from drawing of tetriminos*/
    offsetAuto(offsetDarray, letter) {
        const offsets = [{y:null, x:null}, {y:null, x:null}, {y:null, x:null}, {y:null, x:null}];
        let i = 0;
        for (let y = 0; y < offsetDarray.length; y++) 
            for (let x = 0; x < offsetDarray[y].length; x++) {
                if (letter in offsetDarray[y][x]) {
                    offsets[i].y = y;
                    offsets[i].x = x;
                    i++;
                }
        }
        return offsets;
    }




}