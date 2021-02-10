import React from "react";
import { defineGrid, extendHex } from "honeycomb-grid";
import Tile from "./tile";
import "./sharedRegion.css";
import PhaseIndicator from "./phaseIndicator";

class RegionPlay extends React.Component {
  render() {
    const { G, ctx, moves, playerID, disabled, height } = this.props;

    const {
      board,
      worthOfResources,
      storageTileSelected,
      bankTileSelected,
      storage,
      settingUp,
      declaredWild,
    } = G.players[playerID];

    const HexSize = height / 13;

    const Hex = extendHex({ size: HexSize * 1.15, orientation: "flat" });
    const Grid = defineGrid(Hex);
    const tiles = [];
    const grid = Grid(board);

    const canAffordTile =
      ctx.activePlayers?.[playerID] === "pay_for_tile" &&
      worthOfResources === 2;

    grid.forEach((hex, h) => {
      const { x, y } = hex.toPoint();

      const isPickingFreebie =
        ctx.activePlayers?.[playerID] === "choose_free_tile" &&
        bankTileSelected !== null &&
        G.tileBank[bankTileSelected].split("/")?.[0] === board[h].value;
      let buying =
        canAffordTile &&
        (storage[storageTileSelected].split("/")[0] === board[h].value ||
          (storage[storageTileSelected] === "wild" &&
            declaredWild === board[h].value));

      let start_castle = settingUp === "castle" && board[h].value === "castle";
      let elligible =
        grid
          .neighborsOf(hex)
          .map((element) => element?.inhabited)
          .includes(true) && !board[h].inhabited;

      tiles.push(
        <Tile
          key={h}
          size={HexSize}
          x={x + 30}
          y={y}
          type={board[h].value}
          icon={board[h].inhabited}
          wild={board[h].wild}
          disabled={disabled}
          highlighted={
            (elligible && buying) ||
            (elligible && isPickingFreebie) ||
            start_castle
          }
          onClick={() => {
            if (disabled) return;
            console.log({ elligible, buying, start_castle, isPickingFreebie });
            //console.log({ buying, start_castle, isPickingFreebie });
            if (elligible && buying) moves.pay_for_tile(h);
            else if (start_castle) moves.place_starting_castle(h, playerID);
            else if (elligible && isPickingFreebie) moves.place_tile(h);
          }}
        />
      );
    });

    return (
      <div className="outer">
        <div className="tileArea">{tiles}</div>
        {!disabled && (
          <div style={{ position: "absolute", bottom: "35%", right: "2%" }}>
            <PhaseIndicator G={G} playerID={playerID} height={height * 0.5} />
          </div>
        )}
      </div>
    );
  }
}

export default RegionPlay;
