import { Board } from './tetris';

test('board must be y20 x10', () => {
    const b : Board = new Board();
    const y : number = 20;
    const x : number = 10;
    expect(b.y).toBe(y);
    expect(b.x).toBe(x);
});