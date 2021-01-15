import React from "react";
import Tile from "./tile";

export default function Bonuses({ G, height }) {
  let bonuses = [];

  Object.entries(G.bonuses).forEach(([type, bonus]) => {
    if (bonus.length > 0)
      bonuses.push(
        <div
          key={`${type}-${bonus}`}
          style={{
            height,
            width: height / 1.5,
            backgroundColor: "#f1eed9",
            marginRight: height / 10,
            position: "relative",
            border: "1px solid black",
          }}
        >
          <Tile
            x={height / 3}
            y={height / 3}
            size={height / 4}
            type={type}
            disabled
            icon
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              textAlign: "center",
              fontSize: height / 3.5,
              fontWeight: 700,
            }}
          >
            {bonus[0]}
          </div>
        </div>,
      );
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: "60%",
        left: 0,
        display: "flex",
      }}
    >
      {bonuses}
    </div>
  );
}
