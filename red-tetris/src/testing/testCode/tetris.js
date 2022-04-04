
blueprint = {

}

/* pieces */

class Piece {
    constructor() {
        
    }




}



/* search for cords from drawing of tetriminos*/
function offsetAuto(offsetDarray, letter) {
    const offsets = [{y:0, x:0}, {y:0, x:0}, {y:0, x:0}, {y:0, x:0}];
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
const tetriminos = {

    /* ==== */
    /* offsetsDrawing: 
            [null, 'D', 'B', null],
            ['A', 'AD', 'AB', 'A'],
            ['C', 'CD', 'CB', 'C'],
            [null, 'D', 'B', 'A']
    */
    I : {
        nickname: 'line',
        start: 0,
        offsetsDrawing: [
            [null, 'D', 'B', null],
            ['A', 'AD', 'AB', 'A'],
            ['C', 'CD', 'CB', 'C'],
            [null, 'D', 'B', 'A']
        ],
        Offsets: {
            A:[{y:1, x:0}, {y:1, x:1}, {y:1, x:2}, {y:1, x:3}],
            B:[{y:0, x:2}, {y:1, x:2}, {y:2, x:2}, {y:3, x:2}],
            C:[{y:2, x:0}, {y:2, x:1}, {y:2, x:2}, {y:2, x:3}],
            D:[{y:0, x:1}, {y:1, x:1}, {y:2, x:1}, {y:3, x:1}]
        },

        OffsetsAuto: {
             get A(): { return offsetAuto(this.offsetsDrawing, 'A')},
             get B(): { return offsetAuto(this.offsetsDrawing, 'B')},
             get C(): { return offsetAuto(this.offsetsDrawing, 'C')},
             get D(): { return offsetAuto(this.offsetsDrawing, 'D')}
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
    O : null

}




/*
Array.from(Array(20), () => new Array(10).fill(null));
wrong : Array(2).fill(Array(4));      have been copied by reference. That means a arr[0][0] = 'foo' would actually change two rows instead of one.

*/

/* example of live game init*/
Global = {
    PlayerName : 'bijo',
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
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null,null,null,null]
    ],
    blockedLines : 3,
    score : 78452,
    piece : null,
    history : []
}





/* game fns */
