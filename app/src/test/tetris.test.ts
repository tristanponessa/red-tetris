import { Board } from './tetris';
import { Piece } from './Piece';

test('board must be y20 x10', () => {
    const b : Board = new Board();
    const y : number = 20;
    const x : number = 10;
    expect(b.y).toBe(y);
    expect(b.x).toBe(x);
});

test('board filled empty', () => {
    const b : Board = new Board();
    let iy : number = 0;
    let ix : number = 0;

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

    except(refI.offsets.up).toBe(up);
    except(refI.offsets.right).toBe(right);
    except(refI.offsets.down).toBe(down);
    except(refI.offsets.left).toBe(left);
});