import {Board} from './Board';

export class Game {

    static boards = [];

    /**
     * @param {string[]} names 
     */
    constructor(names) {
        this.boards = {};
        names.forEach(n => this.boards[n] = new Board());
    }

    /**
     * @param {Board} boardExluded well use .name
     * @param {Board[]} boards 
     * @param {number} n
     */
    static giveMalus(boardExluded, n) {
        const bs = Game.boards.filter(b => b.name !== boardExluded.name);
        bs.forEach(b =>  b.insertMalus(n));
    }

    /**
     * @param {Board} boardExluded well use .name
     * @param {Board[]} boards 
     * @param {number} n
     */
    giveMalus_(boardExluded, n) {
        const bs = this.boards.filter(b => b.name !== boardExluded.name);
        bs.forEach(b =>  b.insertMalus(n));
    }
}