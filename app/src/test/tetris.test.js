import { Board } from './Board';
import { Piece } from './Piece';

test('board must be y20 x10', () => {
    const b = new Board();
    const y = 20;
    const x = 10;
    expect(b.y).toBe(y);
    expect(b.x).toBe(x);
});

test('board filled empty', () => {
    const b = new Board();
    let iy = 0;
    let ix = 0;

    for (;iy < b.y;iy++)
        for (;ix < b.x;ix++)
            expect(b.curBoard[iy][ix]).toBe(Piece.tetriminoes.empty);
});

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
    *                   each y x is greater than -1
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
            v.forEach(_v => expect(_v.y).toBeGreaterThan(-1))
            v.forEach(_v => expect(_v.x).toBeGreaterThan(-1))
        });
    }
});


test('pieces random', () => {
    /* we want uniks for 7 in the row */
    let pieces;
    const names = Piece.tetriminoes.names;

    for (let i = 0; i < 100 / 7; i++) {
        pieces = new Array(names.length).fill(undefined).map(e => e = new Piece().curPiece);
        expect(new Set(pieces).size !== pieces.length).toStrictEqual(false); //check dups
    }

});

test('place pieces on Baord', () => { 
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

    const outOfZone1 = {y: -1, x: 0};
    const outOfZone2 = {y: 0, x: -1};
    const outOfZone3 = {y: -1, x: -1};
    const outOfZone4 = {y: new Board().y, x: new Board().x}; //start at 0 so overlap 1
    const outOfZonePieceI = {y: new Board().y - 3, x: 0}; //one part should be outside bottom y maxY + 1 x 0
    const outOfZonePieceL = {y: 0, x: 0}; //one part should be outside 2 lefts 
    const sameZoneAndOutOfZonePieceI = [{y: new Board().y - 2, x: 0}, {y: new Board().y - 3, x: 0}]
    const sameZonePieceI1 = [{y: 0, x: 0}, {y : 0, x : 0}] //with 2 Is
    const sameZonePieceI2 = [{y: 0, x: 0}, {y : 3, x : 0}] //with 2 Is
    const validZonePieceI1 = [{y: 0, x: 0}, {y : 4, x : 4}] //with 2 Is top of eachother

    function ExpectMove(res, boardX, attemptPos, noConditionMovePieceCords) {
        
        let b = boardX.includes('new') ? new Board(boardX[boardX.length - 1]) : boardX;
        const prevPieceCords = b.curPiece.cords;
        const r = b.placeCurPiece(attemptPos);

        expect(r.state).toStrictEqual(res);
        expect(r.cords).toStrictEqual(noConditionMovePieceCords); //if error dont move  r.cords contains if moved despite error
        expect(b.curPiece.cords).toStrictEqual(res === true ? noConditionMovePieceCords : prevPieceCords);

        return b; //for chaining
    }

    //this is internal fn to 
    /*static Piece.GetCords() { 
        return this.offsets[this.curRotation] + this.playerPos;
    }*/

    const offsI = new Piece('I').offsets.up;
    const offsL = new Piece('L').offsets.up;

    //test I and L
    ExpectMove(false, 'newI', outOfZone1, [{y: outOfZone1[0].y + offsI[0].y, x: outOfZone1[0].x + offsI[0].x},
                                            {y: outOfZone1[1].y + offsI[1].y, x: outOfZone1[1].x + offsI[1].x},
                                            {y: outOfZone1[2].y + offsI[2].y, x: outOfZone1[2].x + offsI[2].x},
                                            {y: outOfZone1[3].y + offsI[3].y, x: outOfZone1[3].x + offsI[3].x}])





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


/*test('pieces start', () => { 
    /*
    *  the 4 top cols are not visible 
    * cause 1st position is up rotation 
    *  cause the longest piece I is height 4
    *  so it appears to slowly appear
    *
    *//*
    const b = new Board();
    const startX = b.startPos.y;
    const startY = b.startPos.x;
    const invisibleZoneRangeMaxY = b.invisibleZoneRangeMax.y;
    //const ColRange = new Array(b.y).from(undefined).map(e => e = [0, b.x]);
    

    const names = Piece.tetriminoes.names;
    const pieces = new Array(names.length).fill(undefined).map(e => e = new Piece(e));

    for (let p of pieces) {
        b.dropNewPiece(p);

        expect(b.curPiece.top.y).toStrictEqual(0);
        expect(b.curPiece.bottom.y).toBeLessThanOrEqual(invisibleZoneRangeMaxY);
        expect(b.curPiece.left.x).toStrictEqual(startX);
        expect(b.curPiece.right.x).toBeLessThanOrEqual(b.x);
    }
});*/
/*
test('pieces exist', () => {

    const tetris =  [

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
    ]
});*/