import { Piece } from './Piece';
import { Game } from './Game';
import { ArrayIncludesObj, cmpObjEntries, randString } from './utils';

export class Board {

    //!! becomes undefined after exporting class
    static y = 20; 
    static x = 10;

    constructor(pieceLetter, name=randString(10)) {
        this.y = 20;
        this.x = 10;
        this.name = name;
        this.startPos = {y: 3, x: Math.trunc(this.x / 2)} // in case we wanna change x to ex.11 in the futur, remove fractional part    we begin at 4 cause some pieces have -Y offsets (biggest being -y2  x-2)
        this.invisibleZoneRangeMaxY = 4; //cause the longest piece I is height 4
        this.curBoard = this.newBoard(); //for drawing to display
        this.occupied = []; //[{name: y: x: } * maxPoss] only existant are present
        this.curPiece = new Piece(pieceLetter === undefined ? null : pieceLetter);
        this.playerPos = {...this.startPos};
        this.lives = 2;
        this.score_ = 0;
        this.scoreTable = {'tetris':13_746, 'move': 12, 'rotation': 17};
        this.loose = false;
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

    /**
     * 
     * @param {integer} n TetrisN
     */
    pullAllDown(n) {
        //do not have 'landed mechanism' launched : no new piece 
        //dont call this.placeCurPiece
        //move every single individual cord
        for (const o of this.occupied)
            o.cord.y += n;
    }

    slamDrop() {
        /* throw that piece to the ground like its trash */
        let r;
        let i = 0;
        do {
            r = this.placeCurPiece('down');
            i++;
            if (i > this.y + 10)
                return {msg: 'went beyond board'};
        } while (r.msg !== 'landed')
        return r;
    }

    /**
     * @param {object | string} pos down right left rotate
     * @param {number} pos.y
     * @param {number} pos.x
     * @returns {object} res
     * @returns {boolean} res.state  did update board or not
     * @returns {object} res.cords [{y: x: }  * 4] if moved cords
     * @returns {string} OPTIONAL res.msg landed rotationError ....
     */
    placeCurPiece(pos) {
        /*
        *  does indirect placement
        *  virtually moves, if valid, returns true with new cords BUT does not save in history or anywhere
        *  EXCEPT player pos
        *  only when lands (fails twice going down) it is saved
        *  if you wanna place directly in history with no condition, use this.addBoard but playerPos wont be saved
        */

        const down = pos === 'down';
        const rot = pos === 'rotate';
        //save
        const prevRotation = this.curPiece.curRotation;
        const curPieceCords = this.getPieceCords();

        if (pos === 'down') {
            pos = {y:this.playerPos.y + 1, x:this.playerPos.x};
        }
        if (pos === 'right') {
            pos = {y:this.playerPos.y, x:this.playerPos.x + 1};
        }
        if (pos === 'left') {
            pos = {y:this.playerPos.y, x:this.playerPos.x - 1};
        }
        if (pos === 'rotate') {
            pos = {y:this.playerPos.y, x:this.playerPos.x}; //dont  move
            this.curPiece.rotate();
        }

        //test
        const testPlayerPos = pos;
        const testCurPieceCords = this.getPieceCords(this.curPiece.offsets[this.curPiece.curRotation], testPlayerPos);

        //only happens if you explicitly place here via code , like for a test
        if (testCurPieceCords.some(c => c.x < 0 || c.x >= this.x || c.y < 0))
            return {state: false, cords: testCurPieceCords};
        //if occurs you loose game
        
        //if obst in rotation area 
        if (rot)
            if (this.pieceInOccupied(this.getRotationCords(this.curPiece.name, pos))) {
                this.curPiece.curRotation = prevRotation; //the other resets are to simply return and forget everything but this one explicitly resets due to rotate fn
                return {state: false, cords: testCurPieceCords, msg: 'rotation error'};
            }
        /* uses curPiece object to draw */
        /* checks if can place, if not returns lst of obstacles and does nothing */
        /* if occurs, landed , checks if exisitng piece or beyond floor */
        if (this.pieceInOccupied(testCurPieceCords) || testCurPieceCords.some(c => c.y >= this.y)) {
            let msg = '';
            if (this.playerPos.y === this.startPos.y && this.playerPos.x === this.startPos.x) {
                this.loose = true;
                return {state: false, cords: testCurPieceCords, msg: 'lost game'};
            }
            if (down) {
                this.lives--;
                if (this.lives === 0) {
                    this.addBoard(this.curPiece.name, curPieceCords);
                    this.spawnNewPiece();
                    this.tetrisN();
                    msg = 'landed';
                }
            }
            return {state : false, cords : testCurPieceCords, msg: msg};
        } else {
            //if (LANDED)
            //   this.addBoard(this.curPiece.name, testCurPieceCords);
            this.lives = 2;
            this.playerPos = {...testPlayerPos};
            this.score(rot ? 'rotation' : 'move')
            return {state : true, cords : testCurPieceCords};
        }
    }

    tetrisN() {
        /* checks if tetris removes from occupied and ives malus to opponents */
        let completedRows = this.findCompleteLines();
        if (completedRows.length === 0)
            return;
        this.occupied = this.occupied.filter(e => !completedRows.includes(e.cord.y));
        const tetrisN = completedRows.length;
        this.pullAllDown(tetrisN);
        this.draw() //not mandatory  just in case you call this.curBoard directly by accident
        Game.giveMalus(this, tetrisN);
        this.score(tetrisN);
    }

    /**
     * implicit_arg {[{name: string, cord: {y,x} * N]} this.occupied
     * @returns {string[][]}
     */
    draw() {
        /*
            started out with simple cords but it became to cumbersome to fetch elems and rows
            so we beform a drawing everytime and check from that
        */
        this.curBoard = this.newBoard();
        for (const e of this.occupied) {
            this.curBoard[e.cord.y][e.cord.x] = e.name;
        }
        return this.curBoard //just in case
    }

    /**
     * 
     * @param {string[][]} board 
     */
    fromDrawToOccupied(board) {
        /* updates this.occupied which is cord objects */
        /* only contains piece letters and X indestructible*/
        this.occupied = [];
        for (let y = 0; y < Board.y; y++) {
            for (let x = 0; x < Board.x; x++) {
                if (board[y][x] !== Piece.tetriminoes.empty)
                    this.occupied.push({name: board[y][x], cord: {y,x}});
                //if (board[y][x] === Piece.tetriminoes.indestructible || Piece.tetriminoes.names.includes(board[y][x]))
            }
        }
    }

    findCompleteLines() {
        const l = []; //indexes of this.curBoard
        for (let y = 0; y < this.y; y++)
            if (this.lineComplete(y)) //proforms draw()
                l.push(y);
        return l;
    }

    lineComplete(y) {
        const board = this.draw();
        return board[y].every(e => Piece.tetriminoes.names.includes(e))
    }
    
    insertMalus(n) {
        //when someone tetris, they malus you
        const board = this.draw();
        let bottomBoard = this.y - 1;
        for (let i = 0; i < n; i++, bottomBoard--) {
            board[bottomBoard] = new Array(this.x).fill(Piece.tetriminoes.indestructible);
        }
        this.fromDrawToOccupied(board); //fns using cords objs need the update
    }

    spawnNewPiece() {
        this.lives = 2;
        this.curPiece = new Piece();
        this.playerPos = {...this.startPos};
    }

    /**
     * @param {string} name  tetri name L I T Z or X for indestr.....
     * @param {object[]} pieceCords [{y: x:}, {} ...]
     */
    addBoard(name, pieceCords) {
        for (const c of pieceCords) {
            this.occupied.push({name, cord : c});
        }
    }

    /**
     * @param {object} offsets [{y: x:} * n] 
     * @returns {boolean}
     */
    pieceInOccupied(offsets) {
        //name not clear, if one part of piece is touching one part of piece
        //if 1 cord is touching , its true
        for (const o of this.occupied)
            if (ArrayIncludesObj(offsets, o.cord))
                return true;
    }

    /**
     * @param {string} letter 
     * @param {object} offset {y: x:} | [{y: x:} * n]
     * @returns {bool}
    */
    occupiedContains(letter, offsets) {
        if (!Array.isArray(offsets))
            offsets = [offsets];
        let found = 0;
        for (const off of offsets)
            for (const o of this.occupied) {
                if (cmpObjEntries(off, o.cord) && o.name === letter)
                        found++;
            }
        return found === offsets.length;
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
     * @param {string} pieceLetter char  
     * @param {object} pos {y: x:}
     * @returns {object[]} [{y: x:} n * n] 
     */
    getRotationCords(pieceLetter, pos) {
        /* 
            when piece rotates, it does so in an area 
            which is biggest len of all rots and hight of all rots
            also in n * n
            if an obstacle is in that area 
            it cannot 
            keep in mind, piece always at y0x0 when placed on board
            despite drawing being placed in center
            were calc from piece most top left at 00
        */
        const drawing = Piece.tetriminoes[pieceLetter].drawing;
        const cords = [];
        const offs = {y: pos.y, x :pos.x};
        for (let y = 0; y < drawing.length; y++)
            for (let x = 0; x < drawing[y].length; x++)
                cords.push({y:offs.y+y, x:offs.x+x});
        return cords;
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

    /**
     * @param {number | string} x number for tetrisN or type of move
     */
    score(x) {
        let n;
        if (typeof x === 'number') { n = x * this.scoreTable.tetris}
        if (x === 'move') {n = this.scoreTable.move}
        if (x === 'rotation') {n = this.scoreTable.rotation}
        this.score_ += n;
    }
}


