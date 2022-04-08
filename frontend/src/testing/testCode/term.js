var readlineSync = require('readline-sync');
 
var nbPlayers = parseInt(readlineSync.question('n players ? '));
const playerNames = [];
console.log('game of ' + nbPlayers + ' !'); 
for (let i = 0; i < nbPlayers; i++)
    playerNames.push(readlineSync.question(`name of player ${i}? `));
console.log(playerNames);

