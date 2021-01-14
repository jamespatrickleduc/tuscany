import React from "react";
function PhaseIndicator({ G, playerID, height }) {
  const { hexTiles } = G.players[playerID];
  const stackC = hexTiles.slice(0, 7).length;
  const stackB = hexTiles.slice(7, 14).length;
  const stackA = hexTiles.slice(14, 21).length;

  return (
    <div
      style={{
        backgroundColor: "#AAA",
        height: height,
        width: height / 3,
      }}
    >
      {stackC}
      <br /> {stackB}
      <br /> {stackA}
    </div>
  );
}
export default PhaseIndicator;
