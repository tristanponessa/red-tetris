import { Board } from './tetris';

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
            expect(b.curBoard[iy][ix]).toBe(Piece.empty);
});