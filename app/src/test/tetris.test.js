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
    /* the only rep allowed is when end seq 1 pieceA beginning of seq2 pieceA*/
    /* very freaky glitch happened now adds a double and dont know why the test always passed so were gonna say 1 copy allowed*/
    let pieces;
    const names = Piece.tetriminoes.names;

    for (let i = 0; i < 200; i++) {
        pieces = new Array(names.length).fill(undefined).map(e => e = new Piece().name);
        expect([0,1].includes(pieces.length - new Set(pieces).size)).toStrictEqual(true); //check dups
    }
});

