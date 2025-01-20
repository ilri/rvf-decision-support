/* eslint-disable react/no-this-in-sfc */
import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";

function RainFallChart({ graph_data, isLoader }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!graph_data) {
      // Render an empty chart if no data is available
      const chartOptions = {
        title: {
          text: "Rainfall",
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
            text: "Rainfall (mm)",
          },
        },
        colors: ["#000000", "#FF8970", "#008000"],
        series: [
          {
            name: "<b>Mean Rainfall</b>",
            type: "spline",
          },
          {
            name: "<b>Above Mean Rainfall</b>",
            type: "column",
          },
          {
            name: "<b>Below Mean Rainfall</b>",
            type: "column",
          },
        ],
        chart: {
          className: "colum-block",
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
    const meanRainfall = graph_data.mean_rainfall;

    const categorizedData = data.map((value, index) => {
      const month = dates[index];
      const isAboveMean = value > meanRainfall;
      return { name: month, y: value, aboveMean: isAboveMean };
    });

    const chartOptions = {
      title: {
        text: "Rainfall",
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
          text: "Rainfall (mm)",
        },
        labels: {
          style: {
            fontWeight: "bold",
          },
        },
      },
      tooltip: {
        formatter() {
          const tooltipContent = `
              <span>${this.x}</span><br><b style="color:${this.series.color}">${this.series.name}:${this.y} mm</b><br>`;

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
      colors: ["#000000", "#FF8970", "#008000"],
      series: [
        {
          name: "<b>Mean Rainfall</b>",
          type: "spline",
          data: categorizedData.map(() => meanRainfall),
        },
        {
          name: "<b>Above Mean Rainfall</b>",
          type: "column",
          data: categorizedData.map((item) => (item.aboveMean ? item.y : null)),
        },
        {
          name: "<b>Below Mean Rainfall</b>",
          type: "column",
          data: categorizedData.map((item) => (item.aboveMean ? null : item.y)),
        },
      ],
      chart: {
        className: "colum-block",
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

  return <div ref={chartRef} />;
}

export default React.memo(RainFallChart);
