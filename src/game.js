import uuid from 'uuid/v4';
const segments = require('segments'); // no import

export default class Game {
  static FIRE_RESULTS = {
    INVALID_USER_ID: 'INVALID_USER_ID',
    HIT: 'HIT',
    MISS: 'MISS',
    ALREADY_FIRED: 'ALREADY_FIRED',
  };

  players = {
    /*
    {playerID}: {
      ships: {
        {shipID}: {
          hitsLeft: 2
          length: 3
        }
      },
      board: {
        {shipID}: [x1, y1, x2, y2]
      }
      fires: {
        (${x},${y}): { result: 'hit'/'miss', sunkShipLength: null/4 }
      }
    }
    */
  };

  constructor(id) {
    this.id = id || uuid();
    this.players = {};
  }

  /**
   * Adds a player to the game. Returns the ID of the player.
   * @returns {String} The new player's id.
   */
  addPlayer() {
    let id = uuid();
    this.players[id] = {
      id,
      ships: {},
      board: {},
      fires: {},
    };
    return id;
  }

  /**
   * Gets the player by an ID.
   * @param id The player's uuid.
   * @returns {Player} The player.
   */
  getPlayer(id) {
    return this.players[id];
  }

  /**
   * Fires a missile from {firePlayerID} to {targetPlayerID}. Returns a detailed response.
   * @param firePlayerID The player who is firing.
   * @param targetPlayerID The player ID who's board is being fired upon.
   * @param x The fire x position.
   * @param y The fire y position.
   */
  fire(firePlayerID, targetPlayerID, x, y) {
    // INVALID_USER_ID
    if (!(firePlayerID in this.players) || !(targetPlayerID in this.players)) {
      return {
        result: Game.FIRE_RESULTS.INVALID_USER_ID
      };
    }

    let targetPlayer = this.players[targetPlayerID];
    // ALREADY_FIRED
    let xy = `${x},${y}`;
    if (targetPlayer.fires[xy]) {
      return {
        result: Game.FIRE_RESULTS.ALREADY_FIRED
      };
    }

    // Assume miss
    targetPlayer.fires[xy] = {
      result: Game.FIRE_RESULTS.MISS
    };

    // Go through each ship and see if the fire intersects the ship
    let targetShips = Object.keys(targetPlayer.board);
    for (let i = 0; i < targetShips.length; ++i) {
      let shipID = targetShips[i];
      let s = targetPlayer.board[shipID];
      if (segments.intersect([s[0], s[2]], x) &&
          segments.intersect([s[1], s[3]], y)) {

        // valid hit
        --targetPlayer.ships[shipID].hitsLeft;
        targetPlayer.fires[xy] = {};
        if (targetPlayer.ships[shipID].hitsLeft === 0) {
          targetPlayer.fires[xy].sunkShipLength = targetPlayer.ships[shipID].length;
        }
        targetPlayer.fires[xy].result = Game.FIRE_RESULTS.HIT;

        return targetPlayer.fires[xy];
      }
    }

    return {
      result: Game.FIRE_RESULTS.MISS
    };
  }

  /**
   * Adds a player's ship to the board.
   * @param playerID The player's ID.
   * @param startX The boat start x.
   * @param startY The boat start y.
   * @param endX The boat end x.
   * @param endY The boat end y.
   * @return true if the ship was successfully added.
   */
  addShip(playerID, startX, startY, endX, endY) {
    // Loop through all ships and ensure there's no collision.
    let player = this.players[playerID];
    if (!player) {
      return false;
    }
    // end must be after beginning
    if (startX > endX || startY > endY) {
      return false;
    }
    // Must be a horizontal or vertical line
    if (startX !== endX && startY !== endY) {
      return false;
    }
    let board = player.board;

    // TODO(grant) More efficiently detect collisions.
    // - Currently we go through all ships and check if they collide.
    // - 2x speedup: only check vert/vert horiz/horiz quickly
    // - speedup: Quadtree
    let shipID = uuid();
    let newShipPos = [startX, startY, endX, endY];
    let collision = Object.keys(board).map(shipKey => {
      let otherShipPos = board[shipKey];
      if (newShipPos[1] === newShipPos[3] &&
          newShipPos[3] === otherShipPos[1] &&
          otherShipPos[1] === otherShipPos[3]) { // if both horizontal
        return segments.intersect([newShipPos[0], newShipPos[2]], [otherShipPos[0], otherShipPos[2]]);
      } else if (newShipPos[0] === newShipPos[2] &&
          newShipPos[2] === otherShipPos[0] &&
          otherShipPos[0] === otherShipPos[2]) { // if both vertical
        return segments.intersect([newShipPos[1], newShipPos[3]], [otherShipPos[1], otherShipPos[3]]);
      }
    }).reduce((a, b) => a || b, false);
    if (collision) {
      return false;
    }

    // add the ship (inclusive)
    let length = segments.size([startX, endX]) + segments.size([startY, endY]) + 1;
    player.ships[shipID] = {
      hitsLeft: length,
      length,
    };
    player.board[shipID] = newShipPos;
    return true;
  }
}