import React from "react";

function Popup({ data, isRainfall }) {
  return (
    <div className="notranslate">
      {!data.properties.name_2 && <h6 className="county">{data.properties.name_1}</h6>}
      {data.properties.name_2 && <h6 className="county">{data.properties.name_2}</h6>}
      {isRainfall
        ? data.properties.value !== undefined &&
          data.properties.value !== null && (
            <p className="positive">value: {data.properties.value}</p>
          )
        : data.properties.negative_cases !== undefined &&
          data.properties.negative_cases !== null && (
            <p className="positive">-ve Cases: {data.properties.negative_cases}</p>
          )}
      {!isRainfall &&
        data.properties.positive_cases !== undefined &&
        data.properties.positive_cases !== null && (
          <p className="negative">+ve Cases : {data.properties.positive_cases}</p>
        )}
    </div>
  );
}
export default Popup;
