/* eslint-disable react/no-array-index-key */
import React from "react";
import parse from "html-react-parser";

function DataTable({ data, loader }) {
  const hasData = data && data.length > 0;

  return (
    <div className="table-block">
      {hasData ? (
        <table className="table">
          <thead>
            <tr>
              <th className="category-column">Category</th>
              <th className="all-column1">Activity</th>
              <th className="all-column">Human Health</th>
              <th className="all-column2">Animal Health</th>
            </tr>
          </thead>
          <tbody>
            {data.map((category, categoryIndex) => {
              const totalInterventions = category.activities.reduce(
                (sum, activity) => sum + activity.interventions.length,
                0
              );

              return category.activities.map((activity, activityIndex) =>
                activity.interventions.map((intervention, interventionIndex) => (
                  <tr
                    key={`${category.category}-${activity.activity}-${interventionIndex}`}
                    className={categoryIndex % 2 !== 0 ? "row-color" : "row-odd"}
                  >
                    {activityIndex === 0 && interventionIndex === 0 && (
                      <td rowSpan={totalInterventions}>{category.category_name}</td>
                    )}
                    {interventionIndex === 0 && (
                      <td rowSpan={activity.interventions.length}>{activity.activity_name}</td>
                    )}
                    <td>
                      {intervention.human_health ? parse(String(intervention.human_health)) : "N/A"}
                    </td>
                    <td>
                      {intervention.animal_health
                        ? parse(String(intervention.animal_health))
                        : "N/A"}
                    </td>
                  </tr>
                ))
              );
            })}
          </tbody>
        </table>
      ) : !loader ? (
        <p style={{ textAlign: "center", margin: "2%" }}>Data is not available.</p>
      ) : null}
    </div>
  );
}

export default DataTable;
