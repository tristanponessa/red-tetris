import { Board } from './Board';
import { Piece } from './Piece';

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

/*
test('piece I exists', () => {

    const refI = new Piece('I');
    
    const up =    [{y:1, x:0}, {y:1, x:1}, {y:1, x:2}, {y:1, x:3}];
    const right = [{y:0, x:2}, {y:1, x:2}, {y:2, x:2}, {y:3, x:2}];
    const down =  [{y:2, x:0}, {y:2, x:1}, {y:2, x:2}, {y:2, x:3}];
    const left =  [{y:0, x:1}, {y:1, x:1}, {y:2, x:1}, {y:3, x:1}];

    expect(refI.offsets.up).toStrictEqual(up);
    expect(refI.offsets.right).toStrictEqual(right);
    expect(refI.offsets.down).toStrictEqual(down);
    expect(refI.offsets.left).toStrictEqual(left);
});*/

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

    let b; //save board 

    function ExpectMove(res, boardX, attemptPos, noConditionMovePieceCords) {
        
        let b = boardX instanceof Board ? boardX : new Board(boardX[boardX.length - 1]);
        const prevPieceCords = b.getPieceCords();
        const r = b.placeCurPiece(attemptPos);

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

    //this is internal fn to 
    /*static Piece.GetCords() { 
        return this.offsets[this.curRotation] + this.playerPos;
    }*/

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

    










    /*/
    for (let b of [bPieceI, bPieceL]) {
        
        

        let r1 = b.placeCurPiece(outOfZone1);
        expect(r1).toStrictEqual(false); expect(b.curPiece.pos).toStrictEqual(null);

        

        let r2 = b.placeCurPiece(outOfZone2);
        expect(r2).toStrictEqual(false); expect(b.curPiece.pos).toStrictEqual(null);
        let r3 = b.placeCurPiece(outOfZone3);
        expect(r3).toStrictEqual(false); expect(b.curPiece.pos).toStrictEqual(null);
        let r4 = b.placeCurPiece(outOfZone4);
        expect(r4).toStrictEqual(false); expect(b.curPiece.pos).toStrictEqual(null);

    }

    

    //test piece I
    r = bPieceI.placeCurPiece(outOfZonePieceI); //error
    expect(r).toStrictEqual(false);
    expect(bPieceI.curPiece.pos).toStrictEqual(null);

    //SAME ZONE 
    bPieceI.curPiece = new Piece('I'); //erase or will overlap
    expect(bPieceI.curPiece.pos).toStrictEqual(null);
    r = bPieceI.placeCurPiece(sameZonePieceI1[0]); //valid
    expect(r).toStrictEqual(true);
    expect(bPieceI.curPiece.pos).toStrictEqual(sameZonePieceI1[0]);
    r = bPieceI.placeCurPiece(sameZonePieceI1[1]); //error
    expect(r).toStrictEqual(false);
    expect(bPieceI.curPiece.pos).toStrictEqual(sameZonePieceI1[0]); //if error dont move

    bPieceI.curPiece = new Piece('I'); //erase or will overlap
    expect(bPieceI.curPiece.pos).toStrictEqual(null);
    r = bPieceI.placeCurPiece(sameZonePieceI2[0]); //valid
    expect(r).toStrictEqual(true);
    expect(bPieceI.curPiece.pos).toStrictEqual(sameZonePieceI2[0]);
    r = bPieceI.placeCurPiece(sameZonePieceI2[1]); //error
    expect(r).toStrictEqual(false);
    expect(bPieceI.curPiece.pos).toStrictEqual(sameZonePieceI2[0]); //if error dont move

    bPieceI.curPiece = new Piece('I'); //erase or will overlap
    expect(bPieceI.curPiece.pos).toStrictEqual(null);
    r = bPieceI.placeCurPiece(sameZoneAndOutOfZonePieceI); //error
    expect(r).toStrictEqual(false);
    expect(bPieceI.curPiece.pos).toStrictEqual(null);

    r = bPieceI.placeCurPiece(validZonePieceI1); //valid
    expect(r).toStrictEqual(true);
    expect(bPieceI.curPiece.pos).toStrictEqual(validZonePieceI1);

    //test peice L
    r = bPieceL.placeCurPiece(outOfZonePieceL);
    expect(r).toStrictEqual(true);
    expect(bPieceI.curPiece.pos).toStrictEqual(validZonePieceI1);
    */
});

