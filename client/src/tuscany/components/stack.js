import React from "react";

function Stack({ height, num }) {
  const stack = [];

  const style = {
    backgroundColor: "#999",
    borderRadius: 2,
    height: Math.floor(height / 10),
    width: height / 2,
    margin: 2,
    display: "block",
  };

  for (let i = 0; i < num; i++) {
    stack.push(<div key={i} style={style}></div>);
  }

  return (
    <div
      style={{
        boxSizing: "border-box",
        padding: 1,
      }}
    >
      {stack}
    </div>
  );
}

export default Stack;
