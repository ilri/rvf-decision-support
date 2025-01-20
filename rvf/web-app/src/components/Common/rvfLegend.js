import React from "react";
import _ from "lodash";

function RvfLegend({ palette, units, name }) {
  let legendItems = [];

  if (!_.isEmpty(palette, units)) {
    legendItems = palette.map((color, index) => (
      <li key={color} className="li-color1">
        <div
          style={{
            backgroundColor: color,
            width: "12px",
            height: "12px",
            marginRight: "10px",
          }}
        />
        <span>{units[index]}</span>
      </li>
    ));
  }

  return (
    <div className="legend1">
      <p className="legend-title">
        {name}-
        <br /> Positive
      </p>
      <ul className="color" style={{ padding: 0 }}>
        {legendItems}
      </ul>
    </div>
  );
}

export default RvfLegend;
