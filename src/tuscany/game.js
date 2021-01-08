import { furthestProgress, giveRoundPoints, addLoggerEntry } from "./functions";
import {
  draw_cards,
  select_storage_tile,
  select_bank_tile,
  place_tile,
  upgrade_draw,
  upgrade_storage,
  upgrade_marble,
  upgrade_workers,
  upgrade_yield,
  use_marble,
  dont_use_marble,
  choose_freebie,
  replace_storage,
  update_spend_resources,
  pay_for_tile,
  place_starting_castle,
  cancel_move,
  declare_wild,
  save_board_setup,
} from "./moves";

const Tuscany = {
  name: "tuscany",

  setup: (ctx, setupData) => {
    const neutralTiles = ctx.random.Shuffle([
      ...Array(4).fill("village"),
      "farm/olives&grapes",
      "farm/grapes&wheat",
      "farm/wheat&livestock",
      "farm/livestock&olives",
      ...Array(4).fill("wagon"),
      ...Array(4).fill("monastery"),
      ...Array(4).fill("quarry"),
      ...Array(4).fill("city"),
      ...Array(4).fill("inn"),
      ...Array(4).fill("castle"),
    ]);

    const tileBank = neutralTiles.splice(0, 8);

    const playerTilesBase = [
      ...Array(4).fill("village"),
      "farm/olives",
      "farm/grapes",
      "farm/wheat",
      "farm/livestock",
      ...Array(3).fill("wagon"),
      ...Array(3).fill("monastery"),
      ...Array(3).fill("quarry"),
      ...Array(2).fill("city"),
      ...Array(1).fill("inn"),
      ...Array(1).fill("castle"),
    ];

    let regionDeck = ctx.random.Shuffle([
      ...Array(15).fill("village"),
      ...Array(15).fill("farm"),
      ...Array(15).fill("wagon"),
      ...Array(15).fill("monastery"),
      ...Array(15).fill("quarry"),
      ...Array(15).fill("city"),
      ...Array(15).fill("inn"),
      ...Array(15).fill("castle"),
    ]);

    let yieldDeck = ctx.random.Shuffle([
      ...Array(3).fill("two_cards"),
      ...Array(3).fill("green_point"),
      ...Array(3).fill("card_red_point"),
      ...Array(3).fill("marble"),
      ...Array(3).fill("wild_hex"),
      ...Array(3).fill("two_red_points"),
      ...Array(3).fill("worker"),
    ]);

    let regionBoards = {
      A: ctx.random.Shuffle([0, 1, 2, 3]),
      B: ctx.random.Shuffle([0, 1, 2, 3]),
      C: ctx.random.Shuffle([0, 1, 2, 3]),
    };

    let players = {};
    ctx.playOrder.forEach((id) => {
      players[id] = {
        regionTemplates: [
          regionBoards.A[id],
          regionBoards.B[id],
          regionBoards.C[id],
        ],
        board: null,
        upgrades: {
          draw: 0,
          storage: 0,
          marble: 0,
          workers: 0,
          yield: 0,
        },
        hexTiles: ctx.random.Shuffle(playerTilesBase),
        hand: regionDeck.splice(0, 5).sort(),
        storage: ["socket"],
        marble: 0,
        workers: 0,
        onBonusTurn: false,
        bankTileSelected: null,
        storageTileSelected: null,
        tileToBeStored: null,
        resourcesToBeSpent: [],
        worthOfResources: 0,
        declaredWild: null,
        settingUp: "region",
        greenPoints: 0,
        redPoints: 0,
      };
    });

    return {
      players,
      upgrades: {
        draw: 5,
        storage: 5,
        marble: 5,
        workers: 5,
        yield: 5,
      },
      yieldDeck,
      regionDeck,
      neutralTiles,
      tileBank,
      roundOneScored: false,
      roundTwoScored: false,
      logIndex: 0,
      logEntry: {
        playerID: null,
        entry: null,
      },
    };
  },

  moves: {},

  turn: {
    moveLimit: 0, //0
    endIf: (G, ctx) => {},
    onBegin: (G, ctx) => {
      const gameStart = ctx.turn === 1 && ctx.numMoves === 0;
      if (gameStart) {
        console.log("gameStarted");
        ctx.events.setActivePlayers({
          all: "setup",
          next: { currentPlayer: "do_action" },
        });
      } else {
        ctx.events.setActivePlayers({ currentPlayer: "do_action" });
        G.players[ctx.currentPlayer].onBonusTurn = false;
      }

      const furthest = furthestProgress(G);
      const equalTurns = ctx.playOrderPos === 0;
      if (!G.roundOneScored && furthest <= 14 && equalTurns) {
        G.roundOneScored = true;
        addLoggerEntry(G, "Everyone", `Finished Round One`);
        giveRoundPoints(G, ctx);
      }
      if (!G.roundTwoScored && furthest <= 7 && equalTurns) {
        G.roundTwoScored = true;
        addLoggerEntry(G, "Everyone", `Finished Round Two`);
        giveRoundPoints(G, ctx);
      }
    },
    onEnd: (G, ctx) => {
      G.players[ctx.currentPlayer].storageTileSelected = null;
      G.players[ctx.currentPlayer].bankTileSelected = null;
      G.players[ctx.currentPlayer].tileToBeStored = null;
      G.players[ctx.currentPlayer].resourcesToBeSpent = [];
      G.players[ctx.currentPlayer].worthOfResources = 0;
    },

    stages: {
      setup: {
        moves: {
          save_board_setup,
          place_starting_castle,
          upgrade_draw,
          upgrade_storage,
          upgrade_marble,
          upgrade_workers,
          upgrade_yield,
        },
      },
      do_action: {
        moves: {
          draw_cards,
          select_storage_tile,
          select_bank_tile,
        },
      },
      choose_upgrade: {
        moves: {
          upgrade_draw,
          upgrade_storage,
          upgrade_marble,
          upgrade_workers,
          upgrade_yield,
        },
      },
      use_marble: {
        moves: {
          use_marble,
          dont_use_marble,
        },
      },
      choose_free_tile: {
        moves: {
          select_bank_tile,
          choose_freebie,
          place_tile,
        },
      },
      replace_storage: {
        moves: {
          replace_storage,
          cancel_move,
        },
      },
      pay_for_tile: {
        moves: {
          update_spend_resources,
          pay_for_tile,
          declare_wild,
          place_tile,
          cancel_move,
        },
      },
    },
  },
  endIf: (G, ctx) => {
    const equalTurns = ctx.playOrderPos === 0;
    const furthest = furthestProgress(G);
    if (furthest <= 0 && equalTurns) return true;
  },
  onEnd: (G, ctx) => {
    addLoggerEntry(G, "Everyone", `Finished the Game`);
    giveRoundPoints(G, ctx);
  },
  minPlayers: 2,
  maxPlayers: 4,
};

export default Tuscany;
