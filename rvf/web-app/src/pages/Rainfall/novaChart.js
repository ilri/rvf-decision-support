/* eslint-disable react/no-this-in-sfc */
import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import { useLocation } from "react-router-dom";

function NovaChart({ graphData, isLoader, previewMode, temperatureData }) {
  const chartRef = useRef(null);
  const location = useLocation();
  const isCreateBulletinPath = location.pathname == "/create-news-bulletin";
  useEffect(() => {
    if (!graphData && !temperatureData) {
      // Render an empty chart if no data is available
      const chartOptions = {
        title: {
          text: "Rainfall and Temperature Forecast (GFS - NOAA)",
          align: "left",
        },
        legend: {
          itemMarginBottom: 10, // Adjust the margin size as needed
        },
        credits: { enabled: false },
        xAxis: {
          categories: [], // Empty categories array
          title: { text: "Dates" },
          labels: {
            style: {
              fontWeight: "bold", // Make x-axis labels bold
            },
          },
        },
        yAxis: {
          min: 0,
          title: {
            text: "Precipitation (mm)",
          },
        },
        series: [
          {
            name: "<b>Precipitation</b>",
          },
        ],
        chart: {
          className: isCreateBulletinPath ? "nova-graph" : "colum-block",
          marginRight: 60,
          events: {
            load() {
              if (isLoader) {
                this.showLoading("Loading..."); // Show loading indicator with a message
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

    if (chartRef.current && graphData) {
      const { Timestamp, data } = graphData;

      const categories = Timestamp;
      const seriesData = data;
      const temPeratureSeriseData = temperatureData?.data;
      Highcharts.chart(chartRef.current, {
        chart: {
          type: "column",
          className: isCreateBulletinPath ? "nova-graph" : "colum-block-rainfall",
          marginRight: 60,
          events: {
            load() {
              if (isLoader) {
                this.showLoading("Loading..."); // Show loading indicator with a message
              } else {
                this.hideLoading(); // Hide the loading indicator
              }
            },
          },
        },
        title: {
          text: `Rainfall and Temperature Forecast (GFS - NOAA)`,
          align: "left",
        },
        legend: {
          itemMarginBottom: 10, // Adjust the margin size as needed
        },
        credits: { enabled: false },
        xAxis: {
          title: { text: "Date (YYYY-MM-DD)" },
          categories,
          crosshair: true,
          labels: {
            style: {
              fontSize: "10px",
            },
          },
        },
        yAxis: [
          {
            // Primary Y-axis for Precipitation on the left
            min: 0,
            title: {
              text: "Precipitation (mm)",
            },
            labels: {
              style: {
                fontWeight: "bold", // Make labels bold
              },
            },
          },
          {
            // Secondary Y-axis for Temperature on the right
            title: {
              text: "Temperature (°C)",
            },
            opposite: true, // This positions the Y-axis on the right
            labels: {
              style: {
                fontWeight: "bold", // Make labels bold
              },
            },
          },
        ],
        tooltip: {
          shared: true, // Show tooltips for both series at once
          formatter: function () {
            return `<b>${this.x}</b><br/>
              <span style="color:${this?.points[0]?.color}">\u25CF</span> Precipitation: ${this?.points?.[0]?.y?.toFixed(2)} mm<br/>
              <span style="color:${this?.points[1]?.color}">\u25CF</span> Temperature: ${this?.points?.[1]?.y?.toFixed(1)} °C`;
          },
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0,
          },
        },
        series: [
          {
            name: "Precipitation",
            data: seriesData,
            yAxis: 0,
          },
          {
            name: "Temperature",
            data: temPeratureSeriseData,
            yAxis: 1,
            color: "red",
            // color: "#d5461f",
          },
        ],
      });
    }
  }, [graphData, isLoader, temperatureData]);

  return <div ref={chartRef} className={previewMode ? "chart-container-inactive" : ""} />;
}

export default NovaChart;
