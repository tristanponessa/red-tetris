import { Board } from './Board';
import { Piece } from './Piece';
import { Game } from './Game';

import { ArrayIncludesObj } from './utils';

test('board must be y20 x10', () => {
    const b = new Board();
    const y = 20;
    const x = 10;
    expect(b.y).toBe(y);
    expect(b.x).toBe(x);
});

//test will be added at end when needed to draw
test('board filled empty', () => {
    const b = new Board();
    let iy = 0;
    let ix = 0;

    for (;iy < b.y;iy++)
        for (;ix < b.x;ix++)
            expect(b.curBoard[iy][ix]).toBe(Piece.tetriminoes.empty);
});


test('piece I T offsets made for player pointing at top', () => {
    /* 
        when you want to place a piece on the board, 
        we wanna take the top left most part 
        cords dont have to be in order, just check if present in array

    */

    const refI = new Piece('I');

    //player arrow poiting at top 
    const up =    [{y:0, x:0}, {y:1, x:0}, {y:2, x:0}, {y:3, x:0}];
    const right = [{y:0, x:0}, {y:0, x:1}, {y:0, x:2}, {y:0, x:3}];
    const down =  [...up];
    const left =  [...right];

    expect(refI.offsets.up).toStrictEqual(up);
    expect(refI.offsets.right).toStrictEqual(right);
    expect(refI.offsets.down).toStrictEqual(down);
    expect(refI.offsets.left).toStrictEqual(left);

    //T
    const refT = new Piece('T');

    //player arrow poiting at top 
    const upT =  [{y:0, x:0}, {y:1, x:-1}, {y:1, x:0}, {y:1, x:1}];
    const rightT =  [{y:0, x:0}, {y:1, x:0}, {y:1, x:1}, {y:2, x:0}];
    const downT =  [{y:0, x:0}, {y:0, x:1}, {y:0, x:2}, {y:1, x:1}];
    const leftT =  [{y:0, x:0}, {y:1, x:-1}, {y:1, x:0}, {y:2, x:0}];

    expect(refT.offsets.up).toStrictEqual(upT);
    expect(refT.offsets.right).toStrictEqual(rightT);
    expect(refT.offsets.down).toStrictEqual(downT);
    expect(refT.offsets.left).toStrictEqual(leftT);

});

test('pieces exist', () => {
    /*
    *   in ts, the type system would of tested if specific keys vals is 4 * 4
    *   thanks to specific type 
    *   in js we gotta check it here 
    *   forEach tetriminoes ['I', 'T', 'S', 'Z', 'J', 'L', 'O']
    *   1.check if keys are up down left right 
    *   2.foreach key : check if array of 4 , 
    *                   each array has a y x key , 
    *                   each no array is the same 
    *   
    *   this test is quiet useless due to the one above that checks statics for a couple of pieces 
    *   but this one tests if all pieces are generally formated 
    * */
    const nbBlocks = 4;
    let p;
    for (let n of Piece.tetriminoes.names) {
        p = new Piece(n);
        const keys = Object.keys(p.offsets);
        expect(keys).toStrictEqual(p.rotKeys);
        const vals = Object.values(p.offsets);

        vals.forEach(v => {
            expect(v.length).toStrictEqual(nbBlocks);
            expect(new Set(v).size !== v.length).toStrictEqual(false); //check dups
            v.forEach(_v => expect(Object.keys(_v)).toStrictEqual(['y', 'x']))
        });
    }
});


test('pieces random', () => {
    /* we want uniks for 7 in the row */
    /* the only rep allowed is when end seq 1 pieceA beginning of seq2 pieceA*/
    let pieces;
    const names = Piece.tetriminoes.names;

    for (let i = 0; i < 200; i++) {
        pieces = new Array(names.length).fill(undefined).map(e => e = new Piece().name);
        expect([0].includes(pieces.length - new Set(pieces).size)).toStrictEqual(true); //check dups
    }
});

test('place pieces on Board', () => { 
    /* 
        if placed at out of zone spots or on eachother refuse it with an false return
        in all their start pos : rotation up
        everytime error occurs curPiece keeps its last position
        we dont have to remember where the peices are so no draw fn or table
        we just check this boardX.curPiece.pos  => board.playerPos + curPiece.offsets   [y x * 4]

        playerPos = y x on board  where arrow is
        these board pos are the equivalent of player going directly there (if even mot possible)

        we dont care about rotation cause it doesnt matter if I left or Z up is outborders, we wanna test if we test one part of it outside
    */

    const outOfZone1 = {y: -100, x: 0};
    const outOfZone2 = {y: 0, x: -100};
    const outOfZone3 = {y: -100, x: -100};
    const outOfZone4 = {y: new Board().y, x: new Board().x}; //start at 0 so overlap 1
    const outOfZonePieceI = {y: new Board().y - 3, x: 0}; //one part should be outside bottom y maxY + 1 x 0
    const outOfZonePieceL = {y: 0, x: 0}; //one part should be outside 2 lefts 
    //const sameZoneAndOutOfZonePieceI = [{y: new Board().y - 2, x: 0}, {y: new Board().y - 3, x: 0}]
    const sameZonePieceI1 = [{y: 10, x: 5}, {y : 10, x : 5}] //with 2 Is
    const validZonePieceI1 = [{y: 10, x: 5}, {y : 10, x : 7}] //with 2 Is top of eachother
    const validPieceI2 = {y:0, x:0}; //very small gap betwene expected

    let b; //save board 

    function ExpectMove(res, boardX, attemptPos, noConditionMovePieceCords) {
        
        let b = boardX instanceof Board ? boardX : new Board(boardX[boardX.length - 1]);
        const prevPieceCords = b.getPieceCords();
        const r = b.placeCurPiece(attemptPos);
        if (res === true) //consider it landed 
            b.addBoard(b.curPiece.letter, noConditionMovePieceCords);

        expect(r.state).toStrictEqual(res);
        expect(r.cords).toStrictEqual(noConditionMovePieceCords); //if error dont move  r.cords contains if moved despite error
        expect(b.getPieceCords()).toStrictEqual(res === true ? noConditionMovePieceCords : prevPieceCords);

        return b; //for chaining
    }

    //same exact calc in Board, im wondering if thi sis really a test...
    //a lot more things could happen in the object, here its isolated, 
    //we make sure the calc stay intact
    function expectedCords(pos, offs) {
        return [{y: pos.y + offs[0].y, x: pos.x + offs[0].x},
        {y: pos.y + offs[1].y, x: pos.x + offs[1].x},
        {y: pos.y + offs[2].y, x: pos.x + offs[2].x},
        {y: pos.y + offs[3].y, x: pos.x + offs[3].x}]
    }

    const offsI = new Piece('I').offsets.up;
    const offsL = new Piece('L').offsets.up;

    //test I and L
    
    for (const z of [outOfZone1, outOfZone2, outOfZone3, outOfZone4]) {
        for (const [k,v] of Object.entries({'I': offsI, 'L': offsL}))
            ExpectMove(false, `new${k}`, z, expectedCords(z, v));
    }
    
    ExpectMove(false, `newI`, outOfZonePieceI, expectedCords(outOfZonePieceI, offsI));
    ExpectMove(false, `newL`, outOfZonePieceL, expectedCords(outOfZonePieceL, offsL));

    b = ExpectMove(true, `newI`, sameZonePieceI1[0], expectedCords(sameZonePieceI1[0], offsI));
    ExpectMove(false, b, sameZonePieceI1[1], expectedCords(sameZonePieceI1[1], offsI));

    b = ExpectMove(true, `newI`, validZonePieceI1[0], expectedCords(validZonePieceI1[0], offsI));
    ExpectMove(true, b, validZonePieceI1[1], expectedCords(validZonePieceI1[1], offsI));

    ExpectMove(true, `newI`, validPieceI2, [{y: 0, x:0},{y: 1, x:0},{y: 2, x:0},{y: 3, x:0}]);
});

test('pieces rotate outside board', () => { 
    /* rot only goes right  starts at up than goes forever relooping*/
    const rotKeys = Piece.tetriminoes.rotKeys;

    const p = new Piece();

    for (const r of [...rotKeys, ...rotKeys, 'up']) {
        expect(p.curRotation).toStrictEqual(r);
        p.rotate();
    }
});

test('piece movement / game simulation 1', () => {
    //speed is determined by js speed, not seconds
    //playing the game at different diffulties may change the res
    //the test is in a strict first step second step move down wait for the action ot be done, than move down again
    //compared to no mattter what in n sec pull down , or you being able to move 2 times left before pull down

    let r;

    function checkReturn(movRes, toBe, cords, curPlayerPos) {
        expect(movRes.state).toStrictEqual(toBe);
        expect(movRes.cords).toStrictEqual(cords);
        expect(curPlayerPos).toStrictEqual(toBe === true ? cords[0] : curPlayerPos);
    }

    const moves = [
        //moved down
        {direction: 'right' , res:true, cords: [{y: 1, x:1},{y: 2, x:1},{y: 3, x:1},{y: 4, x:1}]},
        //moved down
        {direction: 'left' , res:true,cords: [{y: 2, x:0},{y: 3, x:0},{y: 4, x:0},{y: 5, x:0}]},
        //moved down
        {direction: 'left' , res:false,cords: [{y: 3, x:-1},{y: 4, x:-1},{y: 5, x:-1},{y: 6, x:-1}]} //fail hit wall*/
    ];

    const pullDownsExp = [
        {res:true, cords:[{y: 1, x:0},{y: 2, x:0},{y: 3, x:0},{y: 4, x:0}]},
        //moved right
        {res:true, cords:[{y: 2, x:1},{y: 3, x:1},{y: 4, x:1},{y: 5, x:1}]},
        //moved left
        {res:true, cords:[{y: 3, x:0},{y: 4, x:0},{y: 5, x:0},{y: 6, x:0}]},
    ]

    const b = new Board('I');
    
    //simulate real game
    
    r = b.placeCurPiece({y:0,x:0});
    checkReturn(r, true, [{y: 0, x:0},{y: 1, x:0},{y: 2, x:0},{y: 3, x:0}], b.playerPos);

    for (let turn = 0; turn < moves.length; turn++) {
        //auto
        r = b.placeCurPiece('down');
        checkReturn(r, pullDownsExp[turn].res, pullDownsExp[turn].cords, b.playerPos)

        r = b.placeCurPiece(moves[turn].direction);
        checkReturn(r, moves[turn].res, moves[turn].cords, b.playerPos)
    }

    //const bottomOfBoard = Board.y - 1;


});


test('pieces land / game simulation 2', () => { 

    /*
                0 1
              :   X
      bottom  -----------------

    */

    let r;
    const bottomOfBoard = new Board().y - 1;
    const theWhole = {y: bottomOfBoard, x:0};
    const theStep = {y: bottomOfBoard - 1, x:1};
    const startPos = {y:bottomOfBoard - 3, x:0};
    let b = new Board();

    b.addBoard('X', [{...theStep}]); //x2 y18 one above bottom: ;

    const p = new Piece('J');
    b.curPiece = p;
    
    //direct landing
    expect(b.lives).toBe(2);

    r = b.placeCurPiece(startPos);
    expect(r.state).toStrictEqual(true);

    r = b.placeCurPiece('down');
    expect(r.state).toStrictEqual(false);
    expect(ArrayIncludesObj(r.cords,theStep)).toStrictEqual(true); //jest contains dontwork for objects as it checks refs with ===
    expect(b.lives).toBe(1);

    r = b.placeCurPiece('down');
    expect(r.state).toStrictEqual(false);
    //went to 0 back to 2 new piece
    expect(b.lives).toBe(2);
    expect(r.msg).toStrictEqual('landed');
    expect(ArrayIncludesObj(r.cords, theStep)).toStrictEqual(true);
    expect(b.occupiedContains('J', startPos)).toStrictEqual(true); //couldnt move so , should be here
    

    //land than move than land
    b = new Board('J');
    b.addBoard('X', [{...theStep}]); //x2 y18 one above bottom: ;

    r = b.placeCurPiece(startPos);
    expect(r.state).toStrictEqual(true);

    r = b.placeCurPiece('down');
    expect(r.state).toStrictEqual(false);
    expect(ArrayIncludesObj(r.cords,theStep)).toStrictEqual(true); //jest contains dontwork for objects as it checks refs with ===
    expect(b.lives).toBe(1);

    r = b.placeCurPiece('right');
    expect(r.state).toStrictEqual(true);
    expect(b.lives).toBe(2);

    r = b.placeCurPiece('right');
    expect(r.state).toStrictEqual(true);
    expect(b.lives).toBe(2);

    r = b.placeCurPiece('down');
    expect(r.state).toStrictEqual(true);
    expect(b.lives).toBe(2);

    r = b.placeCurPiece('down');
    expect(r.state).toStrictEqual(true);
    expect(b.lives).toBe(2);

    r = b.placeCurPiece('down');
    expect(r.state).toStrictEqual(false);
    expect(b.lives).toBe(1);

    r = b.placeCurPiece('down');
    expect(r.state).toStrictEqual(false);
    expect(b.lives).toBe(2);
    expect(r.msg).toStrictEqual('landed');

});

test('piece rotation area', () => {
    /* 
        needed to see if obstacle in way 
        determined by Piece.drawing len height  n * n
    */
    let b = new Board('I');
    const startPos = {y:0, x:0}; 
    b.placeCurPiece(startPos);
    const sizes = { I : {y:4, x:4},
                  O : {y:2, x:2},
                  Rest : {y:3, x:3}};

    

    /*function check(size, pieceLetter, startPos) {

    }*/
    
    for (const p of Piece.tetriminoes.names) {

        b = new Board(p);
        b.placeCurPiece(startPos);
        let rotAreaCords = b.getRotationCords(p, startPos);
        let size = p === 'I' || p === 'O' ? sizes[p] : sizes.Rest;

        expect(rotAreaCords.length).toBe(size.y * size.x);
        for (let y = 0; y < size.y; y++)
                for (let x = 0; x < size.x; x++) {
                    expect(ArrayIncludesObj(rotAreaCords, {y:y, x:x})).toBe(true);
                }
    }
    //b = new Board('I');

    

});

test('pieces rotation on Baord', () => { 
    /* the difficulty of this test is 
        the akward rotation system that is supposed to be diff lines, causint it to jump up one when going back to up rotation
        but in real game play as tested in diff versions, the tetri roatates around a center piece, causing 2 rotations ot exist hori and vertical
        im gonna keep this test very simple, were only gonna check if colisions happen

        1st rotation sys: the piece slides , causing it to be on the next line for a split second, if block on next line, it will prevent
        2nd rotation system : theres also a second rotation system where we can consider rotation is not a slide , but the top block pushes the bottom to the side, causing a rot against a wall possible 
        3rd sys: teleport , nothing block 

        on top of that my offsets system actually ignore the 4 positions since top piece is always at  0 0, even if 2 sides are ay y 1 and y 2 , theyll bboth end y 0 0 

        WE WILL USE 2ND : on the rotation schemas across intenret, theres no mentioning whats so ever of a slide like in 1st sys
        starting at most top left of piece, we will define a ROTATION ZONE of its len/height (n * n) thats defined in static drawing of piece in class Piece

        were not checking each specific pos cause many tests before prooved it worked

        the best exmaple being 

        test : 
 
    */

    let r;
    let b = new Board('I');
    b.placeCurPiece({y:0, x:0});
    
    b.addBoard('X', [{y:3,x:3}]);
    //b.addBoard('X', [{y:0,x:1}]);
    //b.addBoard('X', [{}]); /0/

    r = b.placeCurPiece('rotate'); //always goes right
    expect(r.state).toBe(false); //failed because box in its rot zone
    for (let i = 0; i < 4; i++)
        b.placeCurPiece('down');
    r = b.placeCurPiece('rotate');
    expect(r.state).toBe(true);
    expect(r.cords[0]).toStrictEqual(b.playerPos); //top most left must be on player ptr


});


test('test tetris 4 + give malus' , () => { 

    const By = new Board().y;
    const Bx = new Board().x;

    function nBottomCords(n) {
        let start = By - 1 - n;
        let cords = [];
        for (let y = start; y < By ; y++)
            for (let x = 0; x < Bx ; x++)
                cords.push({y,x});
        return cords;
    }

    const myBoard = new Board('I');
    const opponentBoard = new Board('I');
    Game.boards = [myBoard, opponentBoard]; //will be used inside myBoard inst  !!might mess up futur test cause of Game global  if jest dont isolate
    const startPos = {y:By - 5, x:0};
    const tetrisCords = []; //use to check if pieces left the area after tetris and piece that fallen

    const fallenPieceLetter = '+';
    const fallenPieceStart = {y:By - 8,x:0};
    const fallenPiececords = [fallenPieceStart,{y: fallenPieceStart.y + 1, x:fallenPieceStart.x},{y: fallenPieceStart.y + 2, x:fallenPieceStart.x},{y: fallenPieceStart.y + 3, x:fallenPieceStart.x}]
    const tetrisN = 4;

    myBoard.addBoard(fallenPieceLetter, fallenPiececords); //thuis piece must fall when tetris occurs
    //Is on bottom to form tetris 4 * 4
    for (let y = By - 4; y < By; y++)
        for (let x = 0; x < Bx - 1; x++) {
            tetrisCords.push({y,x});
            myBoard.addBoard('I', [{y,x}]);
            opponentBoard.addBoard('!', [{y,x}]); //we want ot obervse his piece get replaced by Piece.blocked 'X"
        }

        const nBoard = opponentBoard.draw();
        expect(nBoard[By - 4][0]).toStrictEqual('!');

    //last one we must observe while move like in game sim
    let r;
    r = myBoard.placeCurPiece({y:By - 5, x:Bx - 1});
    r = myBoard.slamDrop();

    //check tetris
    expect(r.msg).toStrictEqual('landed');
    //expect(myBoard.curPiece.name).not.toBe('I'); //tetris is a landing so new piece

    
    expect(myBoard.occupiedContains('+', fallenPiececords)).toStrictEqual(true); //only the dropped I on to p of tetris with has letter +
    expect(myBoard.occupied.length === fallenPiececords.length).toBe(true);
    

    //if yes gives malus to opponent threw  Game.insertMalus
    //check that 

    //expect(opponentBoard.occupiedContains('!', {y:By - 4, x:0})).toStrictEqual(false); //O disapeared 
    const nowBoard = opponentBoard.draw();
    for (let y = By - 4; y < By; y++)
        for (let x = 0; x < Bx; x++) {
            expect(nowBoard[y][x]).toStrictEqual(Piece.tetriminoes.indestructible); 
        }
    expect(opponentBoard.occupied.length === 40).toBe(true); 

    
});

test('win / loose game', () => {

    const gameManager = new Game(['trisRetroWave', 'Jesus&Santa', 'BijoDBZ']);

    //fill opp board 
    //add one piece on top 
    for (let y = 0; y < gameManager.boards[0].y; y++)
        for (let x = 0; x < gameManager.boards[0].x; x++) {
            gameManager.boards[1].addBoard('X', [{y,x}]);
            gameManager.boards[2].addBoard('X', [{y,x}]);
        }
    
    gameManager.boards[1].placeCurPiece('down'); //no need of landed mechanism
    gameManager.boards[2].placeCurPiece('down');
    expect(gameManager.boards[1].loose).toBe(true);
    expect(gameManager.boards[2].loose).toBe(true);
    expect(gameManager.boards[0].loose).toBe(false);
    
    const winner = gameManager.getWinner();
    expect(winner.name).toBe('trisRetroWave');

});

//'test game loose'
//test game win  all othe rplayer loose
// score