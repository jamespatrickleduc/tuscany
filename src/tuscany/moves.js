import { INVALID_MOVE } from "boardgame.io/core";
import {
  giveCards,
  checkEndTurn,
  takeTileFromBank,
  giveRegionVPs,
  getTileGroup,
  giveGreenPoints,
  putIntoStorage,
  addLoggerEntry,
} from "./functions";

export const draw_cards = (G, ctx) => {
  console.log("draw cards");
  const bonus = G.players[ctx.currentPlayer].upgrades.draw;
  giveCards(G, ctx.currentPlayer, 2 + bonus);
  addLoggerEntry(G, ctx.currentPlayer, `Drew ${2 + bonus} cards.`);
  checkEndTurn(G, ctx);
};

export const select_storage_tile = (G, ctx, index) => {
  console.log("storage select " + index);
  G.players[ctx.currentPlayer].storageTileSelected = index;
  ctx.events.setActivePlayers({
    currentPlayer: "pay_for_tile",
  });
};

export const select_bank_tile = (G, ctx, index) => {
  console.log("bank select " + index);
  G.players[ctx.currentPlayer].bankTileSelected = index;

  if (ctx.activePlayers[ctx.currentPlayer] === "do_action") {
    putIntoStorage(G, ctx, "bank");
    addLoggerEntry(G, ctx.currentPlayer, `Took a tile`);
  }
};

export const place_tile = (G, ctx, index) => {
  console.log("place tile");
  const { storageTileSelected, bankTileSelected } = G.players[
    ctx.currentPlayer
  ];

  if (storageTileSelected === null && bankTileSelected === null)
    return INVALID_MOVE;

  let tileType;
  if (storageTileSelected !== null) {
    tileType = G.players[ctx.currentPlayer].storage[storageTileSelected];
  } else {
    tileType = G.tileBank[bankTileSelected];
  }

  const hexType = G.players[ctx.currentPlayer].board[index].value;
  if (hexType !== tileType.split("/")[0] && tileType !== "wild") {
    console.log("tile types don't match");
    return INVALID_MOVE;
  }

  G.players[ctx.currentPlayer].board[index].inhabited = true;

  if (tileType === "wild") {
    G.players[ctx.currentPlayer].board[index].wild = true;
  }
  if (storageTileSelected !== null) {
    G.players[ctx.currentPlayer].storage[storageTileSelected] = "socket";
  }

  let wagonText = [];

  if (hexType === "castle") {
    //get hex and place it
    ctx.events.setActivePlayers({
      currentPlayer: "choose_free_tile",
    });
  } else if (hexType === "city") {
    ctx.events.setActivePlayers({
      currentPlayer: "choose_upgrade",
    });
  } else if (hexType === "inn") {
    // G.players[ctx.currentPlayer].storage[0] = "wild";
    putIntoStorage(G, ctx, "wild");
    checkEndTurn(G, ctx);
  } else if (hexType === "farm") {
    if (tileType !== "wild") {
      G.players[ctx.currentPlayer].board[index].value = tileType;
    }
    let group = getTileGroup(G, ctx, index);

    console.log({ wholegroup: group });

    const newTile = group.shift();
    if (newTile.wild) giveGreenPoints(G, ctx.currentPlayer, 1);
    else {
      const newTypes = newTile.value.split("/")[1].split("&");
      const oldTypes = [
        ...group
          .filter((el) => el.inhabited)
          .map((tile) => {
            return tile.value.split("/")[1].split("&");
          }),
      ].flat();

      let farmPoints = 0;

      newTypes.forEach((type) => {
        if (!oldTypes.includes(type)) farmPoints++;
      });

      giveGreenPoints(G, ctx.currentPlayer, farmPoints);
    }

    console.log("get vps");
    checkEndTurn(G, ctx);
  } else if (hexType === "quarry") {
    const increment = G.players[ctx.currentPlayer].upgrades.marble + 1;
    G.players[ctx.currentPlayer].marble += increment;
    checkEndTurn(G, ctx);
  } else if (hexType === "village") {
    const increment = G.players[ctx.currentPlayer].upgrades.workers + 1;
    G.players[ctx.currentPlayer].workers += increment;
    checkEndTurn(G, ctx);
  } else if (hexType === "monastery") {
    giveCards(G, ctx.currentPlayer, 3);
    checkEndTurn(G, ctx);
  } else if (hexType === "wagon") {
    const numCards = G.players[ctx.currentPlayer].upgrades.yield + 1;

    for (let i = 0; i < numCards; i++) {
      const card = G.yieldDeck.pop();
      console.log(`wagon brought ${card}`);

      if (card === "two_cards") {
        wagonText.push("and got 2 cards");
        giveCards(G, ctx.currentPlayer, 2);
      } else if (card === "green_point") {
        wagonText.push("and got a green point");
        G.players[ctx.currentPlayer].greenPoints++;
      } else if (card === "card_red_point") {
        wagonText.push("and got a card and a red point");
        giveCards(G, ctx.currentPlayer, 1);
        G.players[ctx.currentPlayer].redPoints++;
      } else if (card === "marble") {
        wagonText.push("and got a marble");
        G.players[ctx.currentPlayer].marble++;
      } else if (card === "wild_hex") {
        wagonText.push("and got a wild hex");
        putIntoStorage(G, ctx, "wild");
      } else if (card === "two_red_points") {
        wagonText.push("and got two red points");
        G.players[ctx.currentPlayer].redPoints += 2;
      } else if (card === "worker") {
        wagonText.push("and got a worker");
        G.players[ctx.currentPlayer].workers++;
      }
    }
    checkEndTurn(G, ctx);
  }

  addLoggerEntry(
    G,
    ctx.currentPlayer,
    `Placed a ${hexType} ${wagonText.join(", ")}`
  );
  giveRegionVPs(G, ctx, index);
  G.players[ctx.currentPlayer].storageTileSelected = null;
  G.players[ctx.currentPlayer].bankTileSelected = null;
};

//upgrades

const finishUpgrade = (G, ctx, playerID) => {
  if (G.players[playerID].settingUp === "upgrade") {
    G.players[playerID].settingUp = false;
    ctx.events.endStage();
  } else checkEndTurn(G, ctx);
};
export const upgrade_draw = (G, ctx, playerID) => {
  console.log("upgrade draw");
  if (G.upgrades.draw <= 0) return INVALID_MOVE;
  G.players[playerID].upgrades.draw++;
  G.upgrades.draw--;

  addLoggerEntry(G, playerID, `Upgraded Draw`);
  finishUpgrade(G, ctx, playerID);
};
export const upgrade_storage = (G, ctx, playerID) => {
  console.log("upgrade storage");
  if (G.upgrades.storage <= 0) return INVALID_MOVE;
  G.players[playerID].upgrades.storage++;
  G.players[playerID].storage.push("socket");
  G.upgrades.storage--;
  G.players[playerID].greenPoints += 2;

  addLoggerEntry(G, playerID, `Upgraded Storage`);
  finishUpgrade(G, ctx, playerID);
};
export const upgrade_marble = (G, ctx, playerID) => {
  console.log("upgrade marble");
  if (G.upgrades.marble <= 0) return INVALID_MOVE;
  G.players[playerID].upgrades.marble++;
  G.upgrades.marble--;

  addLoggerEntry(G, playerID, `Upgraded Marble`);
  finishUpgrade(G, ctx, playerID);
};
export const upgrade_workers = (G, ctx, playerID) => {
  console.log("upgrade workers");
  if (G.upgrades.workers <= 0) return INVALID_MOVE;
  G.players[playerID].upgrades.workers++;
  G.upgrades.workers--;

  addLoggerEntry(G, playerID, `Upgraded Workers`);
  finishUpgrade(G, ctx, playerID);
};
export const upgrade_yield = (G, ctx, playerID) => {
  console.log("upgrade yield");
  if (G.upgrades.yield <= 0) return INVALID_MOVE;
  G.players[playerID].upgrades.yield++;
  G.upgrades.yield--;
  addLoggerEntry(G, playerID, `Upgraded Wagon Yield`);
  finishUpgrade(G, ctx, playerID);
};

//use marble

export const use_marble = (G, ctx) => {
  console.log("use marble");
  G.players[ctx.currentPlayer].onBonusTurn = true;
  G.players[ctx.currentPlayer].marble--;
  addLoggerEntry(G, ctx.currentPlayer, `Used a Marble`);
  ctx.events.setActivePlayers({ currentPlayer: "do_action" });
};
export const dont_use_marble = (G, ctx) => {
  console.log("dont use marble");
  ctx.events.endTurn();
};

//castle freebies
export const choose_freebie = (G, ctx, bankIndex) => {
  console.log("choose free tile");
  G.players[ctx.currentPlayer].bankTileSelected = bankIndex;

  //checkEndTurn(G, ctx);
};

//replace storage
export const replace_storage = (G, ctx, bankIndex, storageIndex) => {
  console.log("replace tile");
  if (G.players[ctx.currentPlayer].tileToBeStored === "wild") {
    G.players[ctx.currentPlayer].storage[storageIndex] = "wild";
    checkEndTurn(G, ctx);
  } else {
    takeTileFromBank(G, ctx, bankIndex, storageIndex);
  }
  addLoggerEntry(G, ctx.currentPlayer, `Took a ${G.tileBank[bankIndex]} tile`);
};

//pay for tile
export const update_spend_resources = (G, ctx, spendArr, worth) => {
  console.log("update Spend", spendArr, worth);
  G.players[ctx.currentPlayer].resourcesToBeSpent = spendArr;
  G.players[ctx.currentPlayer].worthOfResources = worth;
};

export const pay_for_tile = (G, ctx, index) => {
  const resources = G.players[ctx.currentPlayer].resourcesToBeSpent;
  resources.forEach((resource) => {
    if (resource === "worker") G.players[ctx.currentPlayer].workers--;
    else {
      const index = G.players[ctx.currentPlayer].hand.indexOf(resource);
      G.players[ctx.currentPlayer].hand.splice(index, 1);
    }
  });

  place_tile(G, ctx, index);
};

export const place_starting_castle = (G, ctx, index, playerID) => {
  if (G.players[playerID].settingUp !== "castle") return INVALID_MOVE;
  if (G.players[playerID].board[index].value !== "castle") return INVALID_MOVE;
  G.players[playerID].board[index].inhabited = true;
  G.players[playerID].settingUp = "upgrade";
  addLoggerEntry(G, playerID, `Placed starting Castle`);
};

export const cancel_move = (G, ctx) => {
  G.players[ctx.currentPlayer].storageTileSelected = null;
  G.players[ctx.currentPlayer].bankTileSelected = null;
  ctx.events.setActivePlayers({ currentPlayer: "do_action" });
};

export const declare_wild = (G, ctx, type) => {
  G.players[ctx.currentPlayer].declaredWild = type;
};

export const save_board_setup = (G, ctx, playerID, board) => {
  G.players[playerID].board = board;
  G.players[playerID].settingUp = "castle";
  addLoggerEntry(G, playerID, `Set up their board`);
};
