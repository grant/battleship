import Game from './src/Game';
import test from 'ava';

test('new game', t => {
  let game = new Game();

  let player1 = game.addPlayer();
  let player2 = game.addPlayer();

  t.pass();
});