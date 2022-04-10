/*
Player has 
    Game has 
        Board has 
            Pieces static 
*/

/* 
       game is the collection of players with their scores, boards, ....
       player requests action to the board 
       the board checks, moves if possible, gens pieces, the real controller 
       piece is pure static with data 
*/


class Game {

    constructor(playerNames) {
        this.players = playerNames.map(n => new Player(n))
        //one player has the launch game for all method 
        //run each game
    }
}


class Player {
    
    constructor(name) {
        this.name = name;
        this.gravity = 10; //difficulty pull down s 
        this.lost = false;
        this.board = new Board();
        this.score = 0;

        this.

        this.runGame();
    }


    runGame() { 

        setInterval(this.gravity, () => this.board.pullDown())
        Eventlistener(RECEIVE MALUS (N) => this.drawMalus(N))

        while (1) {
            
            if (this.board.looseCondition()) {
                this.lost = true;
                return ;
            }

            

            KEY MOVE :
                
                n = if tetrisMove
                apply MALUS to other PLAYERS 





            


        }
    }


}



//call Game?
class Board {

    /*
        '-' nothing there
        'X' indestructible
        '+' curpiece  only used on testBoard
    */


    constructor() {

        //player data
        this.playerPos = this.startPos;

        //board data
        this.rowN = 20;
        this.colN = 10;
        this.startPos = {y: 0, x: 4};
        this.hiddenRows = [0, 1, 2, 3];
        this.board = Array.from(Array(20), ()=>new Array(10).fill(Piece.tetriminoes.empty))
        this.blockedRowsStart = Board.bluePrint.rowN;

        //piece data 
        this.curPiece = Piece.random(); //ref to static data
        this.Piecelives = 2; //allowed to hit board ground until cant move anymore
        this.curRotation = 'horizantal';
        //this.calcPieceCords;
    }

    *iter(type='col', order='+', startY=0, steps=null) {
        //naming conventions: 
        //when calling type row , usually use row of iter('row') { row.nb } instead of row.y 
        //when calling cord of iter() { cord.y or .x }
        if (order === '+') {
            for (let y = startY; y < Board.bluePrint.rowN; y++) {
                if (type === 'row')
                    yield {nb:y, value:this.board[y]} 
                for (let x = 0; x < Board.bluePrint.colN; x++)
                    yield {y, x, value:this.board[y][x]}; 
            }
        }

        if (order === '-') {
            for (let y = Board.bluePrint.rowN; y > 0; y--) {
                if (type === 'row')
                    yield {nb:y, value:this.board[y]}
                for (let x = Board.bluePrint.colN; x > 0; x--)
                    yield {y, x, value:this.board[y][x]};
            }
        }
    }

        /* @param {Piece} piece */
    looseCondition() {
        /* if any piece cord is out of bounds */
        /* determined on draw */
        if (this.curPiece.lives === 0 && 
            Board.bluePrint.hiddenRows.includes(this.curPiece.getHighestY()))
            return true;
    }

    tetrisMove() {

        let n = 0;
        const emptyRow = new Array(Board.bluePrint.colN).fill(Piece.tetriminoes.empty);

        for (let row of this.iter('row')) {
            if (row.every(col => Piece.tetriminoes.names.includes(col))) {
                n++;
                this.board[row.nb] = emptyRow;
            }
        }
        //SeND MALUS TO OTHERS (N)
        return n;
    }

    drawMalus(n) {
        //you receive malus just writes over
        const indestructibleRow = new Array(Board.bluePrint.colN).fill(Piece.tetriminoes.indestructible);
        this.blockedRowsStart -= n - 1;
        for (let row of this.iter('row', '-', Board.bluePrint.rowN, this.blockedRowsStart))
            row.value = indestructibleRow; //if dont get ref , use this.board[row.y] = 
    }

    move(direction) {
        
        const attemptMove = {...this.playerPos};
        const attemptRotation = curRotation;

        if (direction === 'up') {
            attemptRotation = Piece.nextRotation(this.curRotation);
            //doesn't move
        }
        else if (direction === 'down')
            attemptMove.y += 1;
        else if (direction === 'left')
            attemptMove.x -= 1;
        else if (direction === 'right')
            attemptMove.x += 1;
        
        /* uses curPiece object to draw */
        /* checks if can place, if not returns lst of obstacles and does nothing */
        
        const testBoard = [...this.board];

        for (let cord of this.piece.curCords) {
            //testBoard[cord.y][cord.x] += this.piece.name;
            testBoard[cord.y][cord.x] += '+'; //for current
        }

        //check if landed or inContact
        const obstacles = findObstacles();
        if (obstacles.length > 0) {
            if (obstacles.includes(this.piece.lowestY()))
                this.pieceLooseLife();
            //else hit x and cant move
        } else { 
            cleanTest();
            update();
        }

        function cleanTest() {
            for (let cord of this.piece.curCords) {
                if (testBoard[cord.y][cord.x] === '+-')
                    testBoard[cord.y][cord.x] = this.piece.name;
            }
        }

        function update() {
            this.board = [...testBoard];
            this.playerPos = {...attemptPlayerPos};
            this.curRotation = attemptRotation;
        }
    
        function findObstacles() {
            /* get all floor cords */
              //check lands
              const obstacles = [];
              for (let y = Board.bluePrint.rowN; y > 0; y--)
                  for (let x = 0; x < Board.bluePrint.colN; x++) {
                      if (testBoard[y][x].match(new RegExp(`+[${Piece.bluePrint.names}${Piece.bluePrint.indestructible}]{1}`)))
                          obstacles.push({y, x})
                }
        }

    }

    pullDown() {
        //for set interval auto move
        this.move('down');
    }

    pieceLooseLife() {
        this.Piecelives--;
        if (this.Piecelives === 0) {
            this.newPiece();
        }
    }

    newPiece() {
        this.curPiece = Piece.random();
        this.curRotation = 'horizontal';
        this.Piecelives = 2;
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
            name: 'I',
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
                get horizantal() { return this.offsetAuto(this.offsetsDrawing, 'A');},
                get d90()      { return this.offsetAuto(this.offsetsDrawing, 'B');},
                get vertical() { return this.offsetAuto(this.offsetsDrawing, 'C');},
                get d180() { return this.offsetAuto(this.offsetsDrawing, 'D');}
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
        indestructible : 'X',
        empty: '-',
        new: '+'
    };



    static randomPiece() {
        const keys = Object.keys(Piece.bluePrint.tetriminoes);
        const rkey = keys[ keys.length * Math.random() << 0];
        return Piece.tetriminoes[rkey];
    }

    static rotate() {
        this.curRotation = this.nextRotation();
        this.curPos = this.curPiece.OffsetsDynamic[this.curRotation];
    }

    static nextRotation(rotationName) {
        let i = Piece.tetriminoes.rotationKeys.findIndex(rotationName);
        i++;
        if (i > Piece.tetriminoes.rotationKeys.length - 1)
            i = 0;
        return Piece.tetriminoes.rotationKeys[i];
    }

    /* search for cords from drawing of tetriminos*/
    static offsetAuto(offsetDarray, letter) {
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

    static calcPieceCords() {
        /* piece playerPos on board + offset */
        const cords = [];
        const pos = this.playerPos;
        const offsets = this.pieceData.OffsetsDynamic[this.curRotation];

        for (let i = 0; i < offsets.length; i++)
            cords.push({y: pos.y + offsets[i].y, 
                        x: pos.x + offsets[i].x});
    
        return cords;
    }
    
    static getHighestY() {
        /* check if on top of board */
        let highestY = 0;
        for (let i = 0; i < this.curPos; i++) {
            if (this.curPos[i].y > highestY)
                highestY = this.curPos[i].y;//{...this.curPos[i]};
        }
        return highestY;
    }

    static getLowestY() {
        /* check if landed */
        let lowestY = Board.bluePrint.rowN;
        for (let i = 0; i < this.curPos; i++) {
            if (this.curPos[i].y < lowestY)
                lowestY = this.curPos[i].y//{...this.curPos[i]};
        }
        return lowestY;
    }
}


function main() {

}