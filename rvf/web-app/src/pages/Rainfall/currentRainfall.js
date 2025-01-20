/* eslint-disable react/no-this-in-sfc */
import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import { useLocation } from "react-router-dom";

function RainFallChart({ graph_data, isLoader, previewMode }) {
  const chartRef = useRef(null);
  const location = useLocation();
  const isCreateBulletinPath = location.pathname == "/create-news-bulletin";

  useEffect(() => {
    if (!graph_data) {
      // Render an empty chart if no data is available
      const chartOptions = {
        title: {
          text: "Rainfall Anomalies (GPM)",
          align: "left",
        },
        legend: {
          itemMarginBottom: 10, // Adjust the margin size as needed
        },
        credits: { enabled: false },
        xAxis: {
          categories: [], // Empty categories array
          title: { text: "Months" },
          labels: {
            style: {
              fontWeight: "bold", // Make x-axis labels bold
            },
          },
        },
        yAxis: {
          title: {
            text: "Anomalies (z score)",
          },
          plotLines: [
            {
              value: 0,
              color: "#100101",
              dashStyle: "shortdash",
              width: 2,
            },
          ],
        },
        colors: ["#f8b38b", "#D07A49", "#D5461F"],
        series: [
          {
            name: "<b>Low</b>",
            type: "column",
          },
          {
            name: "<b>Moderate</b>",
            type: "column",
          },
          {
            name: "<b>High</b>",
            type: "column",
          },
        ],
        chart: {
          className: isCreateBulletinPath ? "rainfall-graph" : "colum-block",
          marginRight: 60,
          events: {
            load() {
              if (isLoader) {
                this.showLoading(); // Show loading indicator with a message
              } else {
                this.hideLoading(); // Hide the loading indicator
              }
            },
          },
        },
      };

      if (chartRef.current) {
        Highcharts.chart(chartRef.current, chartOptions);
      }

      return;
    }

    const data = graph_data.data;
    const dates = graph_data.dates;

    const highData = data.map((value) => (value > 2 ? value : null));
    const lowData = data.map((value) => (value <= 1 ? value : null));
    const moderateDate = data.map((value) => (value > 1 && value <= 2 ? value : null));

    const chartOptions = {
      title: {
        text: `Rainfall Anomalies (GPM)`,
        align: "left",
      },
      legend: {
        itemMarginBottom: 10, // Adjust the margin size as needed
      },
      credits: { enabled: false },
      xAxis: {
        categories: dates,
        title: { text: "Months" },
        labels: {
          style: {
            fontWeight: "bold", // Make x-axis labels bold
          },
        },
      },
      yAxis: {
        title: {
          text: "Anomalies (z score)",
        },
        labels: {
          style: {
            fontWeight: "bold",
          },
        },
        plotLines: [
          {
            value: 0,
            color: "#100101",
            dashStyle: "shortdash",
            width: 1,
            zIndex: 5,
          },
        ],
      },
      tooltip: {
        formatter() {
          const tooltipContent = `
              <span>${this.x}</span><br><b style="color:${this.series.color}">${this.y}</b><br>`;

          return tooltipContent;
        },
      },
      plotOptions: {
        series: {
          borderRadius: "10%",
        },
        column: {
          stacking: "normal",
          threshold: null,
        },
      },
      colors: ["#f8b38b", "#D07A49", "#D5461F"],
      series: [
        {
          name: "<b>Low</b>",
          type: "column",
          data: lowData,
        },
        {
          name: "<b>Moderate</b>",
          type: "column",
          data: moderateDate,
        },
        {
          name: "<b>High</b>",
          type: "column",
          data: highData,
        },
      ],
      chart: {
        className: isCreateBulletinPath ? "rainfall-graph" : "colum-block",
        marginRight: 60,
        events: {
          load() {
            if (isLoader) {
              this.showLoading(); // Show loading indicator with a message
            } else {
              this.hideLoading(); // Hide the loading indicator
            }
          },
        },
      },
    };
    if (chartRef.current) {
      Highcharts.chart(chartRef.current, chartOptions);
    }
  }, [graph_data, isLoader]);

  return (
    <div ref={chartRef} className={previewMode ? "chart-container-inactive" : "chart-container"} />
  );
}

export default React.memo(RainFallChart);
