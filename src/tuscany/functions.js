import { defineGrid, extendHex } from "honeycomb-grid";
import uniqid from "uniqid";

export const giveCards = (G, player, num) => {
  const cards = G.regionDeck.splice(0, num);
  G.players[player].hand.push(...cards);
  G.players[player].hand.sort();
};

export const giveGreenPoints = (G, player, num) => {
  G.players[player].greenPoints += num;
};
export const giveRedPoints = (G, player, num) => {
  console.log({ G, player, num });
  G.players[player].redPoints += num;
};

export const checkEndTurn = (G, ctx) => {
  console.log("marble: " + G.players[ctx.currentPlayer].marble);

  if (
    G.players[ctx.currentPlayer].onBonusTurn ||
    G.players[ctx.currentPlayer].marble === 0
  )
    ctx.events.endTurn();
  else {
    console.log("use marble?");
    ctx.events.setActivePlayers({ currentPlayer: "use_marble" });
  }
};

export const takeTileFromBank = (G, ctx, bankIndex, slot) => {
  console.log({ bankIndex, slot });
  G.players[ctx.currentPlayer].storage[slot] = G.tileBank[bankIndex];
  G.tileBank[bankIndex] = G.players[ctx.currentPlayer].hexTiles.pop();
  G.players[ctx.currentPlayer].bankTileSelected = null;
  checkEndTurn(G, ctx);
};

export const giveRegionVPs = (G, ctx, index) => {
  const group = getTileGroup(G, ctx, index);
  const groupFinished = group.reduce((acc, cur) => cur.inhabited && acc, true);

  console.log("group finished: " + groupFinished);
  if (groupFinished) {
    if (group.length === 1) G.players[ctx.currentPlayer].greenPoints += 1;
    if (group.length === 2) G.players[ctx.currentPlayer].greenPoints += 3;
    if (group.length === 3) G.players[ctx.currentPlayer].greenPoints += 6;
  }
};

export const getTileGroup = (G, ctx, index) => {
  const Hex = extendHex({ orientation: "flat" });
  const Grid = defineGrid(Hex);
  const { board } = G.players[ctx.currentPlayer];
  const grid = Grid(board);

  let group = [];
  group.push(JSON.parse(JSON.stringify(board[index])));

  const findSameNeighbors = (hex, ignores) => {
    let ret = [];
    let neighbors = grid
      .neighborsOf(hex)
      .filter((neighbor) => neighbor !== undefined);

    const groupType = hex.value.split("/")[0];
    neighbors.forEach((neighbor) => {
      if (
        neighbor.value.split("/")[0] === groupType &&
        ignores.find((el) => neighbor.x === el.x && neighbor.y === el.y) ===
          undefined
      ) {
        ret.push(neighbor);
      }
    });
    return ret;
  };

  group = [...group, ...findSameNeighbors(Hex(board[index]), group)];
  if (group.length === 2) {
    group = [...group, ...findSameNeighbors(group[1], group)];
  }
  return group;
};

export const putIntoStorage = (G, ctx, from) => {
  console.log("put into storage" + from);
  const emptySpot = G.players[ctx.currentPlayer].storage.indexOf("socket");

  if (emptySpot > -1) {
    if (from === "bank")
      takeTileFromBank(
        G,
        ctx,
        G.players[ctx.currentPlayer].bankTileSelected,
        emptySpot
      );
    else if (from === "wild") {
      G.players[ctx.currentPlayer].storage[emptySpot] = "wild";
    }
  } else if (ctx.activePlayers[ctx.currentPlayer] === "do_action") {
    ctx.events.setActivePlayers({ currentPlayer: "replace_storage" });
  }
};

export const giveRoundPoints = (G, ctx) => {
  Object.entries(G.players).forEach(([id, player]) => {
    giveRedPoints(G, id, player.greenPoints);
  });
};

export const furthestProgress = (G) => {
  return Object.values(G.players).reduce((acc, cur) => {
    if (cur.hexTiles.length < acc) {
      acc = cur.hexTiles.length;
    }
    return acc;
  }, 100);
};

export const addLoggerEntry = (G, playerID, entry) => {
  G.logIndex++;
  G.logEntry = {
    playerID,
    entry,
  };

  console.log({ index: G.logIndex, entry });
};
