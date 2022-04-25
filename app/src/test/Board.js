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

    /**
     * @param {string} type row col box 
     * @param {string} order + -
    */
    /**iter(type='box', order='+') {
        
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
    }*/

    /*placeCurPiece(pos) {

        let r = {state: true, cords: null};
        const testBoard = [...this.board];
        //save all
        const prevPlayerPos = this.playerPos;
        const prevPieceCords = this.curPiece.cords;
        //attempt   proform calculations ot see if any weird stuff
        this.playerPos = pos;
        const newPieceCords = this.getPieceCords()

        //check if outside   just check if in board range
        if (every(newPieceCords.map(c => c.y > -1 && c.y < this.y 
                                            && c.x > -1 && c.x < this.x)))
        //check if overlaped with another piece
        //draw on board string[][] for curboard state
        

    }*/

    /**
     * @param {object} pos 
     * @param {number} pos.y
     * @param {number} pos.x
     * @returns {object} res
     * @returns {boolean} res.state  did update board or not
     * @returns {object} res.cords [{y: x: }  * 4] if moved cords
     */
    move(pos) {   //direction

        const res = {state: null, cords: null};

        //SAVE
        //const attemptRotation = curRotation;
        //const prevPlayerPos = {...this.playerPos};
        //const prevCurPieceCords = {...this.curPiece.cords};
        //TRY
        const testPlayerPos = pos;
        const testCurPieceCords = this.getPieceCords(this.offsets[this.curPiece.curRotation], testPlayerPos);

        /*
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
        */
        
        /* uses curPiece object to draw */
        /* checks if can place, if not returns lst of obstacles and does nothing */
        
        const testBoard = [...this.board];

        for (let cord of this.testCurPieceCords) {
            //testBoard[cord.y][cord.x] += this.curPiece.name;
            testBoard[cord.y][cord.x] += '+'; //for current
        }

        //check if landed or inContact
        const obstacles = findObstacles();
        if (obstacles.length > 0) {
            if (obstacles.includes(this.lowestY(testCurPieceCords))) {
                res.state = false;
                res.cords = testCurPieceCords;
            }
                //this.pieceLooseLife();
            //else hit x and cant move
        } else { 
            res.state = true;
            res.cords = testCurPieceCords;
            cleanTest();
            update();
        }

        return res;

        function cleanTest() {
            for (let cord of testCurPieceCords) {
                if (testBoard[cord.y][cord.x] === '+-')
                    testBoard[cord.y][cord.x] = this.curPiece.name;
            }
        }

        function update() {
            this.board = [...testBoard];
            this.playerPos = {...testPlayerPos};
            //this.curRotation = attemptRotation;
        }
    
        function findObstacles() {
            /* get all floor cords */
              //check lands
              const obstacles = [];
              for (let y = this.y; y > 0; y--)
                  for (let x = 0; x < this.x; x++) {
                      if (testBoard[y][x].match(new RegExp(`+[${Piece.bluePrint.names}${Piece.bluePrint.indestructible}]{1}`)))
                          obstacles.push({y, x})
                }
        }
    }

    getPieceCords(offsets, pos) {
        
        let off = this.curPiece.offsets[this.curPiece.curRotation];
        let p1 = this.playerPos;

        if (offsets !== undefined)
            off = offsets;
        if (pos !== undefined)
            p1 = pos;

        return ([
                {y: p1.y + off[0].y, x: p1.x + off[0].x},
                {y: p1.y + off[1].y, x: p1.x + off[1].x},
                {y: p1.y + off[2].y, x: p1.x + off[2].x},
                {y: p1.y + off[3].y, x: p1.x + off[3].x}
            ]
        );
    }

    /**
     * @param {object} pieceOffsets [{y: x: } * 4]
     * @returns {object} {y: x:}
     */
    PieceLowestY(pieceOffsets) {
        /* check if landed */
        let lowestY = this.y;
        for (let i = 0; i < Object.keys(pieceOffsets).length; i++) {
            if (pieceOffsets[i].y < lowestY)
                lowestY = pieceOffsets[i].y//{...this.curPos[i]};
        }
        return lowestY;
    }

    /*dropNewPiece(pieceLetter) {
        this.curPiece = new Piece(pieceLetter === undefined ? undefined : pieceLetter);
    }*/
}


