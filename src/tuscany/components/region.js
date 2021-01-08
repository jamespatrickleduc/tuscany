import React from "react";
import RegionPlay from "./regionPlay";
import RegionSetup from "./regionSetup";
import Card from "react-bootstrap/Card";
import "./region.css";

function Region({ G, ctx, moves, playerID }) {
  const { settingUp } = G.players[playerID];

  const regionBoard =
    settingUp === "region" ? (
      <RegionSetup G={G} ctx={ctx} moves={moves} playerID={playerID} />
    ) : (
      <RegionPlay G={G} ctx={ctx} moves={moves} playerID={playerID} />
    );

  console.log({ settingUp });
  return (
    <Card className="border-0">
      <Card.Body>{regionBoard}</Card.Body>
    </Card>
  );
}

export default Region;
