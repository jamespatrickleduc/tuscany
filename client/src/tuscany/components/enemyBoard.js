import React from "react";
import useWindowSize from "../hooks/windowSize";
import RegionPlay from "./regionPlay";
import Inventory from "./inventory";
import PhaseIndicator from "./phaseIndicator";
import { mdiDiamondOutline } from "@mdi/js";
import Icon from "@mdi/react";
import Badge from "react-bootstrap/Badge";

function EnemyBoard({ G, ctx, id, matchData }) {
  let [width, height] = useWindowSize();
  height *= 0.2;
  width *= 0.5;

  const name = matchData.find((el) => el.id === Number(id))?.name || id;

  const onTurn = ![undefined, "setup"].includes(ctx.activePlayers?.[id]);

  const { greenPoints, redPoints, bonusTurn } = G.players[id];

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
      <div style={{ position: "absolute", top: 0, left: 5 }}>
        {name}({id})
      </div>
      {bonusTurn && (
        <Icon
          path={mdiDiamondOutline}
          size={height / 120}
          style={{
            position: "absolute",
            top: "30%",
            left: "1%",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          left: "1%",
          bottom: "2%",
          fontSize: height / 8,
        }}
      >
        <Badge style={{ margin: 4, display: "block" }} variant="success">
          {greenPoints}
        </Badge>
        <Badge style={{ margin: 4, display: "block" }} variant="danger">
          {redPoints}
        </Badge>
      </div>
      <div style={{ position: "absolute", top: "14%", left: "8%" }}>
        <RegionPlay
          G={G}
          ctx={ctx}
          playerID={id}
          height={height * 1.1}
          disabled
        />
      </div>
      <div style={{ position: "absolute", bottom: "1%", left: "60%" }}>
        <PhaseIndicator G={G} playerID={id} height={height} />
      </div>
      <div style={{ marginTop: "1%" }}>
        <Inventory G={G} playerID={id} ctx={ctx} height={height} disabled />
      </div>
    </div>
  );
}

export default EnemyBoard;
