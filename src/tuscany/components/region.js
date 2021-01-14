import React from "react";
import RegionPlay from "./regionPlay";
import RegionSetup from "./regionSetup";
import Card from "react-bootstrap/Card";
import "./region.css";

import useWindowSize from "../hooks/windowSize";

function Region({ G, ctx, moves, playerID }) {
  const { settingUp } = G.players[playerID];

  let [width, height] = useWindowSize();

  const [xScale, yScale] = [0.5, 0.4];

  const regionBoard =
    settingUp === "region" ? (
      <RegionSetup
        G={G}
        ctx={ctx}
        moves={moves}
        playerID={playerID}
        height={height * yScale}
      />
    ) : (
      <RegionPlay
        G={G}
        ctx={ctx}
        moves={moves}
        playerID={playerID}
        height={height * yScale}
      />
    );

  //console.log({ settingUp });
  return (
    <div style={{ height: height * yScale, width: width * xScale }}>
      {regionBoard}
    </div>
  );
}

export default Region;
