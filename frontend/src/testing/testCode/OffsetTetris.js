/*
    a blueprint is something static that you copy that will be dynamic
*/


/*
Array.from(Array(20), () => new Array(10).fill(null));
wrong : Array(2).fill(Array(4));      have been copied by reference. That means a arr[0][0] = 'foo' would actually change two rows instead of one.

*/


const playerBlueprint = {
    PlayerName : null,
    board : Array.from(Array(20), ()=>new Array(10).fill(null)),
    blockedLines : 0,
    score : 0,
    piece : null,
    history : []
};

const liveGameBlueprint = {
    turn : 0,
    gravity: 10, /* pull interval seconds */
    nbPlayers: 0
};



/* -------------------------------------------------------------------------------  */


/* search for cords from drawing of tetriminos*/
function offsetAuto(offsetDarray, letter) {
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



/* offsets represents all positions rotations in a box 
    when player moves, we simply apply offsets of current ratation letter to player cintrol center
*/
const tetriminosBlueprint = {

    rotationKeys : ['horizontal', 'd90', 'vertical', 'd180'],
    /* ==== */
    I : {
        nickname: 'line',
        start: 0,
        color: 'cyan',
        offsetsDrawing: [
            [null, 'D', 'B', null],
            ['A', 'AD', 'AB', 'A'],
            ['C', 'CD', 'CB', 'C'],
            [null, 'D', 'B', null]
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
    Indestructible : null
};


class Tetriminos {
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

    move(direction) {
        if (!this.landed()) {
            if (direction === 'up')
                this.rotateRight();
            if (direction === 'down')
                this.curPos.y += 1;
            if (direction === 'left')
                this.curPos.x -= 1;
            if (direction === 'right')
                this.curPos.x += 1;
        }
    }

    draw(board) {
        for (cord of this.curOffsets) {

            /* if in contact */

            /* if all ok */
            board[this.curPos + cord.y][this.curPos + cord.x] = this.name;
        }
    }

    landed(board, y, x) {
        copyboard = [...board];
        for (cord of this.curOffsets) {

            if ((this.curBlueprint.offsetsDrawing[this.curPos.y][this.curPos.x] !== null) && \
                    )
                 board[this.curPos + cord.y][this.curPos + cord.x] = this.name;
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





function Main() {
    initGame();
    runGame():
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