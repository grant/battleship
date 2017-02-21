# battleship

An API for playing the game [**Battleship**](https://en.wikipedia.org/wiki/Battleship_(game)).

Battleship is a guessing game played by two players.

## Game
Create game.

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
npm test
```