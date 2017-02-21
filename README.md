# battleship

An API for playing the game [**Battleship**](https://en.wikipedia.org/wiki/Battleship_(game)).

Battleship is a guessing game played by two players.
When a ship is sunk, you announce "You sank my battleship" (or 3-size, etc.) 

## Game
Create game.
- Board(width, height)
  - x tiles: (0 .. width-1)
  - y tiles: (0 .. height - 1)

## TODO
- Create a basic API for a normal game.
  - Create a new board
  - Place ships on a board id
  - Start a game with a board (validate the board)
  - Hit an (x, y)
    - Hit, Miss, Sunk(boat)
- Create a UI for the API.
- Make the game scale to hundreds of square tiles and thousands of ships of various lengths.

# Inspiration
Inspired by an interview question.

- http://www.datagenetics.com/blog/december32011/
- https://battleship-game.org/

# Tests
Run tests:
```
yarn
npm test -- --watch
```