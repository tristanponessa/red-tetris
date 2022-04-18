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
        this.players = playerNames.map(n => new Player(this, n))
        //one player has the launch game for all method 
        //run each game
    }
}


class Player {
    
    constructor(gameObj, name) {
        this.gameObj = gameObj;
        this.name = name;
        this.gravity = 10; //difficulty pull down s 
        this.lost = false;
        this.board = new Board();
        this.score = 0;

        this.keyBindings = {
            'up' : () => Board.move('up'),
            'down': () => Board.move('down'),
            'right': () => Board.move('right'),
            'left': () => Board.move('left')
            //space
        }

        this.runGame();
    }


    async runGame() { 

        setInterval(this.gravity, () => this.board.pullDown())
        //Eventlistener(RECEIVE MALUS (N) => this.drawMalus(N))
        await 
        
            
            if (this.board.looseCondition()) {
                this.lost = true;
                return ;
            }

            if (0 < n = this.board.tetrisMove())
                this.GameObj.players.map(p => p.drawMalus(n))

            if (key = keyPress() in Object.keys(this.keyBindings)) {
                this.keyBindings[key];
            }





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
        this.limits = {minY:0, maxY: 20, minX: 0, maxX: 10}
        this.startPos = {y: 0, x: 4};
        this.hiddenRows = 3; //0 -> 3
        this.board = Array.from(Array(20), ()=>new Array(10).fill(Piece.tetriminoes.empty))
        this.blockedRowsStart = Board.bluePrint.rowN;

        //piece data 
        this.curPiece = Piece.random(); //ref to static data
        this.Piecelives = 2; //allowed to hit board ground until cant move anymore
        this.curRotation = 'horizantal';
        //this.calcPieceCords;
    }

    /**
     * @param {string} type row col box 
     * @param {string} order + -
     */
    *iter(type='box', order='+') {
        
        //naming conventions: 
        //when calling type row , usually use row of iter('row') { row.nb } instead of row.y 
        //when calling cord of iter() { cord.y or .x }

        startY = '+' ? this.limits.maxY : this.limits.minY;
        limitY = '+' ? this.limits.maxY : this.limits.minY;
        startX = '+' ? this.limits.maxY : this.limits.minX;
        limitX = '+' ? this.limits.maxY : this.limits.minX;
        step = '+' ? 1 : -1;

        if (order === 'col') {
            //col first iter than row
            for (let i = startX; i !== limitX; i += step) 
                for (let i = startY; i !== limitY; i += step) {
                    yield {y, x, value:this.board[y][x]};
                }
        } else {
            for (let i = startY; i !== limitY; i += step) {
                if (type === 'row')
                    yield {nb:y, value:this.board[y]}
                for (let i = startX; i !== limitX; i += step)
                    yield {y, x, value:this.board[y][x]};
            }
        }
    }

        /* @param {Piece} piece */
    looseCondition() {
        /* if any piece cord is out of bounds */
        /* determined on draw */
        if (this.curPiece.lives === 0 && 
            Board.bluePrint.hiddenRows > this.curPiece.getHighestY())
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
        for (let row of this.iter('row')) {
            if (row.y >= this.blockedRowsStart)
                row.value = indestructibleRow; //if dont get ref , use this.board[row.y] = 
        }
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

        /*
        function findObstacles2() {
            if (this.curPiece.lowestY in floor())
                this.pieceLooseLife();
            if ( in [])
                return false;//dont do anything
            
        }*/



    }

    //floor changes ,   top right left ground static 

    floor() {
        // look down col, the piece's level is the ground and if none, the gorund itself
        const floor = []; 
        for (col of this.iter(undefined, 'col')) {
            if (col.value !== Piece.tetriminoes.empty || col.y === this.limits - 1) //on the ground of board
                floor.push({y:col.y, x:col.x});
        }
    }

    top() {
        top = []
        for (box of this.iter())
            if (box.y === this.hiddenRows)
                return top;
            this.top.push({y:box.y, x:box.x});
    }

    rightSide() {
        right = []
        for (let y = 0; y < this.limits.maxY; y++)
            right.push({y, x:this.limits.maxX});
        return right;
    }

    leftSide() {
        left = []
        for (let y = 0; y < this.limits.maxY; y++)
            left.push({y, x:this.limits.minX});
        return left;
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

    static getMostRight() {
        /* check if landed */
        let HighestX = Board.bluePrint.colN;
        for (let i = 0; i < this.curPos; i++) {
            if (this.curPos[i].x < HighestX)
                HighestX = this.curPos[i].x//{...this.curPos[i]};
        }
        return HighestX;
    }

    static getMostRight() {
        /* check if landed */
        let lowestX = 0;
        for (let i = 0; i < this.curPos; i++) {
            if (this.curPos[i].x > lowestX)
                lowestX = this.curPos[i].x//{...this.curPos[i]};
        }
        return lowestX;
    }


}


function main() {

}