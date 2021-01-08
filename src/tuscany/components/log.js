import React, { useState, useEffect, useRef } from "react";
import "./log.css";
import Card from "react-bootstrap/Card";

function Log({ G, ctx, matchData }) {
  console.log({ matchData });
  const [entries, setEntries] = useState([]);
  const scrollBottomRef = useRef(null);
  const logIndex = G.logIndex;

  useEffect(() => {
    console.log({ entry: G.logEntry });
    if (G.logEntry.playerID !== null) {
      setEntries(() => [...entries, G.logEntry]);
    }
  }, [logIndex]);

  useEffect(() => {
    scrollBottomRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }, [entries]);

  const rows = [];
  entries.forEach((entry, e) => {
    console.log({ matchData, entry });
    const { name } = matchData.find((el) => el.id === Number(entry.playerID));
    rows.push(<EntryRow key={e} playerName={name} entry={entry.entry} />);
  });

  return (
    <Card>
      <Card.Body>
        <Card.Title>Log</Card.Title>
        <Card.Text>{rows}</Card.Text>
        <div ref={scrollBottomRef} style={{ height: "1px" }}></div>
        <div className="whatNow">
          <WhatNow G={G} ctx={ctx} />
        </div>
      </Card.Body>
    </Card>
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
        </span>
      );
    });
  else {
    //the game is probably over, huh
  }

  return <div>{happening}</div>;
};

const EntryRow = ({ playerName, entry }) => {
  return (
    <div>
      <b>{playerName}</b> - {entry}
    </div>
  );
};
