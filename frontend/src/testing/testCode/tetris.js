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

    static tetriminioes = {
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
            Indestructible : 'X',
            empty: '-'

        }

        constructor(tetriminosBlueprint) {
        
            this.name = this.randomProperty(tetriminosBlueprint, 'key');
            this.curBlueprint = tetriminosBlueprint[this.name]; //ref
            this.rotKeys = Object.keys(this.curBlueprint.OffsetsDynamic);
            this.curRotation = 'horizantal';
            this.curOffsets = this.curBlueprint.OffsetsDynamic[this.curRotation] //copy {00,11,21,01}
            this.curPos = {y: 0, x:4}; //piece is placed around your pointer
            
        }
    
        rotateRight() {
            this.curRotation = this.nextRotation();
            this.curOffsets = this.curBlueprint.OffsetsDynamic[this.curRotation];
        }
    
        move(board, direction) {

            oldOffsets = this.oldCords //ref copy? we need copy
            oldPos = this.curPos; //ref copy?

            if (!this.landed()) {
                if (direction === 'up')
                    this.rotateRight();
                if (direction === 'down')
                    this.curPos.y += 1;
                if (direction === 'left')
                    this.curPos.x -= 1;
                if (direction === 'right')
                    this.curPos.x += 1;
                
                /* clean before placing piece */
                for (oldcord of this.oldOffsets) {
                    board[oldcord + oldPos.y][oldcord + oldPos.x] = this.tetriminioes.empty;
                }
                for (cord of this.curOffsets) {
                    /* if in contact */
                    board[this.curPos + cord.y][this.curPos + cord.x] = this.name;
                }
        }
        
        landed(board) {
            for (cord of this.curOffsets) {
                if (board[cord.y + this.curPos][cord.x + this.curPos] !== this.tetriminioes.empty &&
                    this.offsetsDrawing[cord.y][cord.x] !== this.tetriminioes.empty)
                    return ?;
            }
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


function newPiece() {
    /* player cur piece is random */
}

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

*/