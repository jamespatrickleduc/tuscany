import React, { useState, useEffect, useRef } from "react";
import "./log.css";

import useWindowSize from "../hooks/windowSize";

function Log({ G, ctx, matchData }) {
  //console.log({ matchData });
  const scrollBottomRef = useRef(null);

  let [width, height] = useWindowSize();
  width *= 0.5;
  height *= 0.4;

  useEffect(() => {
    scrollBottomRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }, [G.log]);

  const rows = [];
  G.log.forEach((entry, e) => {
    //console.log({ matchData, entry });
    const name =
      matchData.find((el) => el.id === Number(entry.playerID))?.name ||
      entry.playerID;
    rows.push(<EntryRow key={e} playerName={name} entry={entry.entry} />);
  });

  return (
    <div
      style={{
        marginTop: height * 0.02,
        height: height * 0.95,
        width: width * 0.95,
        borderRadius: 4,
        border: "1px solid #333",
        margin: "0 auto",
        backgroundColor: "#FFF",
      }}
    >
      <div
        style={{
          height: "85%",
          width: "98%",
          margin: "1%",
          border: "1px solid #aaa",
          overflowY: "scroll",
        }}
      >
        <div>{rows}</div>
        <div ref={scrollBottomRef} style={{ height: "1px" }}></div>
      </div>
      <div className="whatNow">
        <WhatNow G={G} ctx={ctx} />
      </div>
    </div>
  );
}

export default Log;

const WhatNow = ({ G, ctx }) => {
  let happening = [];

  if (ctx.activePlayers)
    Object.entries(ctx.activePlayers).forEach(([id, action]) => {
      happening.push(
        <span key={id} className="mx-2">
          {id} is doing {action}
        </span>,
      );
    });
  else {
    //the game is probably over, huh
  }

  return <div>{happening}</div>;
};

const EntryRow = ({ playerName, entry }) => {
  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          width: "29%",
          fontWeight: 700,
          textAlign: "right",
          verticalAlign: "top",
          marginRight: 2,
        }}
      >
        {playerName}
      </div>
      <div style={{ width: "1%", verticalAlign: "top" }}>-</div>
      <div style={{ width: "70%", verticalAlign: "top", marginLeft: 2 }}>
        {entry}
      </div>
    </div>
  );
};
