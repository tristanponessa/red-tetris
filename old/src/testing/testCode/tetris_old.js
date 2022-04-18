class Player {

    static bluePrint = {
        PlayerName : null,
        board : Array.from(Array(20), ()=>new Array(10).fill(null)),
        blockedLines : 0,
        score : 0,
        piece : null,
        history : []
    }

    constructor (playerName) {
        this.data = {...Player.bluePrint};
        this.data.PlayerName = playerName;
    }
}

class Board {

    /*
        '-' nothing there
        'X' indestructible
    */
    constructor() {
        this.board =  Array.from(Array(20), ()=>new Array(10).fill(null))

    }

    clean() {}


}


class Piece {

    static tetriminoes = {
            rotationKeys : ['horizontal', 'd90', 'vertical', 'd180'],
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
            indestructible : 'X',
            empty: '-'

        }

        constructor() {
            this.curBlueprint = Piece.tetriminoes[this.name]; //ref
            this.rotKeys = Object.keys(this.curBlueprint.OffsetsDynamic);
            newPiece();
        }

        newPiece() {
            /* player cur piece is random */
            this.name = this.randomProperty(Piece.tetriminoes, 'key');
            this.curRotation = 'horizantal';
            this.curOffsets = this.curBlueprint.OffsetsDynamic[this.curRotation] //copy {00,11,21,01}
            this.curPos = {y: 0, x:4}; //piece is placed around your pointer
        }

        PieceCords(pos=null, offsets=null) {

            const cords = [];
            const pos = (!pos) ? this.curPos : pos;
            const offsets = (!offsets) ? this.curOffsets : offsets;

            for (let i = 0; i < offsets.length; i++)
                cords.push({y: pos.y + offsets[i].y, 
                            x: pos.x + offsets[i].x});
        
            return cords;
        }
    
        rotateRight() {
            this.curRotation = this.nextRotation();
            this.curOffsets = this.curBlueprint.OffsetsDynamic[this.curRotation];
        }
    
        move(board, direction) {
            /*
                 move only if no obstacle : 
                 1.inContact   do nothing
                 2.landed  gen new piece
            */
            
            const attempBoard = [...board];
            const attemptMove = {...this.curPos};
            let attempCords;
            let attemptRotation; 
            let attemptOffsets;
            
            if (direction === 'up') {
                attemptRotation = this.nextRotation();
                attemptOffsets = Piece.tetriminoes.OffsetsDynamic[attemptRotation];
                //doesn't move
            }
            else if (direction === 'down')
                attemptMove.y += 1;
            else if (direction === 'left')
                attemptMove.x -= 1;
            else if (direction === 'right')
                attemptMove.x += 1;
            
            attempCords = this.PieceCords(attemptMove, attemptOffsets);

            const obstacles = this.Obstacles(board);
            //IF y NEW PIECE
            if (obstacles.includes('Y'))

            if (obstacles.includes('+X'))
            if (obstacles.includes('-X'))
            
            


            /*if (typeofLanded === 'inContact')
                return ; //do nothing
            else if (typeofLanded === 'landed') {
                this.draw();
                this.newPiece();
            }
            else
                this.draw();
            */
        }

        draw(board) {
            board = [...board];
            const oldOffsets = {...this.curOffsets}
            const oldPos = {...this.curPos};

            /* clean before placing piece */
            for (oldcord of this.oldOffsets) {
                board[oldcord + oldPos.y][oldcord + oldPos.x] = Piece.tetriminoes.empty;
            }
            for (cord of this.curOffsets) {
                /* if in contact */
                board[this.curPos + cord.y][this.curPos + cord.x] += this.name; //evaluates if yourPiece P '-P' no touch nor contact or 'ZP' in contact
            }
            return board
        }
        
        Obstacles(board) {
            /* if any piece at edge or on other piece */
            /* for each piece[x4] look +y +x -x */

            const curCords = this.PieceCords();
            let BoardNextY;
            let BoardNextX;
            let BoardPrevX;
            const obstacles = [];
            //let pieceObstacle;

            for (let i = 0; i < curCords.length; i++) {

                //pieceObstacle = [];
                BoardNextY = board[curCords.y + 1][curCords.x];
                BoardNextX = board[curCords.y][curCords.x + 1];
                BoardPrevX = board[curCords.y][curCords.x - 1];

                if (BoardNextY !== Piece.tetriminoes.empty)
                    obstacles.push('Y');
                if (BoardNextX !== Piece.tetriminoes.empty)
                    obstacles.push('+X');
                if (BoardPrevX !== Piece.tetriminoes.empty)
                    obstacles.push('-X');
                //obstacles.push(pieceObstacle);
            }
            return obstacles;
        }
    
        /* static fns dont use this */
    
        randomProperty(obj, which='val') {
            const keys = Object.keys(obj);
            rkey = keys[ keys.length * Math.random() << 0];
            return which === 'key' ? rkey : obj[rkey];
        };
        
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


/*
** @property {Player} players
*/

class Game {

    static bluePrint = {
        turn : 0,
        gravity: 10, /* pull interval seconds */
        players: []
    }

    constructor(playerNames, gravity) {
        this.data = {...this.bluePrint};
        this.data.gravity = gravity;
        for (p of playerNames)
            this.data.players.push(new Player(p));
    }

}
















/* game fns */




function looseCondition() {
    return /* if pulldown done and piece outside bounds */
}
function winCondition() {
    return /* check all other players have loosecondition true */
}
function pullDown(player) {
    /* by keybind or setInterval  bottom of curpiece move vertical down  y + 1*/
    player.move('down');
}
function landed() {
    return /* check piece present right under curpiece on any side */
}
function tetrisMove(nb) {/* n lines cleared  set them to null and pull down one on top most down possible */}

/* for 1 player */

function keyPress(key, player) {
    switch (key.e) {
        case 'right' : break;
        case 'left' : break;
        case 'down' : break;
        case 'up' : break;
        case 'space': break;
        default: ;
    }
}


function runGame(liveGame, player) {

    player = Plyaer()

    //async
    setInterval(pullDown(player), liveGame.gravity);


    //sync
    if (player.curPiece === null || landed(player.curPiece()))
        player.curPiece = newPiece();
    
    if (player.looseCondition())
        player.loose = true;
        return;
    
    
    
    
    





    liveGame.turn++;
}


//TeST with terminal   launch with node.js

function initGame1() {
    return {
        player : Player(),
        game : Game(),

    }
}



function Main() {
    initGame();
    runGame();
}

Main();



/* ----------------------- EXAMPLE ----------------------------------*/



/* example of live game init
playerAI1curGame = {
    PlayerName : 'bijo',
    lost : false,
    board : [
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,'I',   null,null,null,null,null,null,null,null],
        [null,'I',   null,null,null,null,null,null,null,null],
        [null,'I',   null,null,null,null,null,null,null,null],
        [null,'I',   null,null,null,null,null,null,null,null]
    ],
    blockedLines : 3,
    score : 78452,
    piece : null,
    history : []
}*/


/*


function fakeGame() {
    watch ais play or already setup play
}

function fakeTerminalFront() {
    instead of react display threw node.js terminal
}






if ([BoardNextY, BoardNextX, BoardPrevY].map( x => !notZone.includes(x)))

            if (board[cord.y + this.curPos + 1][cord.x + this.curPos] !== undefined &&
                board[cord.y + this.curPos + 1][cord.x + this.curPos + 1] !== undefined &&
                board[cord.y + this.curPos + 1][cord.x + this.curPos] !== Piece.tetriminoes.empty &&
                this.offsetsDrawing[cord.y][cord.x] !== Piece.tetriminoes.empty)
            }

            return 'landed' or'inContact'
            


            for (let y = 0; y < board.length; y++) 
            for (let x = 0; x < board[y].length; x++) {
                if (!board[y][x].includes(Piece.tetriminoes.empty) &&
                    board[y][x].includes(this.name))

*/