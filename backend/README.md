### Red-Tetris Backend

Handles game logic, game state and sends data in real time to the connected
players.

## Game

This is a simple Tetris with a basic grid of 10 columns and 20 lines. The speed
of tetrominoes is fixed. It can be played either alone or in multiplayer mode.
In this mode each player has a board and can see a ghost version of the others
(only the first occupied block of each column is visible to the other players).

## TODO

- implement game logic
- share state to the front through a socke.io server
- use git hooks for automated tests on pre-push (mocha chai ?)

## MAYBE

- create a shared 'lib' directory for game logic functions (for solo games)
