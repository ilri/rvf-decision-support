import React from "react";
import _ from "lodash";

function CustomLegend({ palette, units, indicator, name, min, max, isRainfall, isRvfModelling }) {
  if (_.isEmpty(palette)) {
    return null; // Return null if the palette is empty
  }

  // Create a gradient string from the palette colors
  const gradientColors = palette.join(", ");

  return (
    <div className={isRvfModelling ? "legend-rvf-modelling " : "legend"}>
      {/* <p className="legend-title1">{isRainfall ? `${name} Anomaly` : `${name} ${units ? (units) : ""}`}</p> */}
      <p className="legend-title1">
        {isRainfall ? `${name} Anomaly` : `${name} ${units ? `(${units})` : ""}`}
      </p>
      <div className="gradient-container">
        <p className="min-max min-space notranslate">{min}</p>
        <div
          className="legend-gradient"
          style={{ background: `linear-gradient(90deg, ${gradientColors})` }}
        />
        <p className="min-max max-space notranslate">{max}</p>
      </div>
      <p className="legend-title2">{indicator}</p>
    </div>
  );
}

export default CustomLegend;
