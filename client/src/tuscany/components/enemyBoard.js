import React from "react";
import useWindowSize from "../hooks/windowSize";
import RegionPlay from "./regionPlay";
import Inventory from "./inventory";
import PhaseIndicator from "./phaseIndicator";
import { mdiDiamondOutline } from "@mdi/js";
import Icon from "@mdi/react";

function EnemyBoard({ G, ctx, id, matchData }) {
  let [width, height] = useWindowSize();
  height *= 0.2;
  width *= 0.5;

  const name = matchData.find((el) => el.id === Number(id))?.name || id;

  const onTurn = ![undefined, "setup"].includes(ctx.activePlayers?.[id]);
  const bonusTurn = G.players[id].onBonusTurn;

  return (
    <div
      style={{
        position: "relative",
        margin: 4,
        height,
        width,
        borderRadius: 4,
        backgroundColor: onTurn ? "#c9d7f7" : "#e0e0e0",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0 }}>
        {name}({id})
      </div>
      {bonusTurn && (
        <Icon
          path={mdiDiamondOutline}
          size={height / 120}
          style={{
            position: "absolute",
            top: "40%",
            left: "1%",
          }}
        />
      )}
      <RegionPlay
        G={G}
        ctx={ctx}
        playerID={id}
        height={height * 1.2}
        disabled
      />
      <PhaseIndicator G={G} playerID={id} height={height} />
      <Inventory G={G} playerID={id} ctx={ctx} height={height} disabled />
    </div>
  );
}

export default EnemyBoard;
