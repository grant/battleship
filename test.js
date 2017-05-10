import Game from './src';
import test from 'ava';

test('new game', t => {
  let game = new Game();

  let player1 = game.addPlayer();
  let player2 = game.addPlayer();

  let ship1Success = game.addShip(player1, 0, 0, 0, 5);
  let ship2Success = game.addShip(player1, 1, 2, 1, 3);

  t.pass();
});

test('add ships in illegal positions fail', t => {
  let game = new Game();
  let player1 = game.addPlayer();
  t.false(game.addShip(player1, 0, 0, 1, 1));
  t.false(game.addShip(player1, -2, -3, 1, 1));
  t.false(game.addShip(player1, 1, 1, 0, 0));
  t.true(game.addShip(player1, 1, 1, 1, 3));
  t.true(game.addShip(player1, -1, 1, -1, 3));
});

test('add ships on top of each other fails', t => {
  let game = new Game();
  let player1 = game.addPlayer();
  // vertical
  t.true(game.addShip(player1, 0, 1, 0, 4));
  t.false(game.addShip(player1, 0, 1, 0, 2));
  t.false(game.addShip(player1, 0, 2,  0, 3));

  // horizontal
  t.true(game.addShip(player1, 1, 0, 2, 0));
  t.true(game.addShip(player1, 4, 0, 6, 0));
  t.false(game.addShip(player1, 4, 0, 5, 0));
});

test('hit/miss', t => {
  let game = new Game();
  let player1ID = game.addPlayer();
  let player2ID = game.addPlayer();
  //
  game.addShip(player1ID, 1, 1, 2, 1);
  t.deepEqual(game.fire('foo', player1ID, 0, 1), {
    result: Game.FIRE_RESULTS.INVALID_USER_ID
  });
  t.deepEqual(game.fire(player2ID, player1ID, 0, 1), {
    result: Game.FIRE_RESULTS.MISS
  });
  t.deepEqual(game.fire(player2ID, player1ID, 0, 1), {
    result: Game.FIRE_RESULTS.ALREADY_FIRED
  });
  t.deepEqual(game.fire(player2ID, player1ID, 1, 1), {
    result: Game.FIRE_RESULTS.HIT
  });
  t.deepEqual(game.fire(player2ID, player1ID, 1, 1), {
    result: Game.FIRE_RESULTS.ALREADY_FIRED
  });
  t.deepEqual(game.fire(player2ID, player1ID, 2, 1), {
    result: Game.FIRE_RESULTS.HIT,
    sunkShipLength: 2,
  });
});
