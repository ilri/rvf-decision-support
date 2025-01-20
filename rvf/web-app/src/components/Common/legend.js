import React from "react";
import _ from "lodash";

function Legend({ legend }) {
  let legendItems = [];

  if (!_.isEmpty(legend)) {
    legendItems = legend.map(({ color, name }) => (
      <li key={color} className="li-color1">
        <div
          style={{
            backgroundColor: color,
            width: "12px",
            height: "12px",
            marginRight: "10px",
          }}
        />
        <span>{name}</span>
      </li>
    ));
  }

  return (
    <div className="legend2">
      <p className="legend-title">Risk Level</p>
      <ul className="color" style={{ padding: 0 }}>
        {legendItems}
      </ul>
    </div>
  );
}

export default Legend;
