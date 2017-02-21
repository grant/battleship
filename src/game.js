import uuid from 'uuid/v4';

export default class Game {
  players = {};

  constructor(id) {
    this.id = id || Math.random() + '';
    this.players = {};
  }

  /**
   * Adds a player to the game. Returns the ID of the player.
   * @returns {Player} The new player.
   */
  addPlayer() {
    let id = uuid();
    this.players[id] = {
      id,
    };
    return this.players[id];
  }

  /**
   * Gets the player by an ID.
   * @param id The player's uuid.
   * @returns {Player} The player.
   */
  getPlayer(id) {
    return this.players[id];
  }

  addShip(playerID, x, y, length) {

  }
}