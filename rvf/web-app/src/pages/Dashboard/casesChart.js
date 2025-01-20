/* eslint-disable react/no-this-in-sfc */
import React, { useEffect, useRef } from "react";
import Highcharts from "highcharts";

function CasesChart({ graphData, graph_data, isLoader }) {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!graphData || !graph_data) {
      const chartOptions = {
        title: {
          text: "RVF Cases",
          align: "left",
        },
        legend: {
          itemMarginBottom: 10, // Adjust the margin size as needed
        },
        credits: { enabled: false },
        xAxis: {
          categories: [],
          title: { text: "Months" },
          labels: {
            style: {
              fontWeight: "bold", // Make x-axis labels bold
            },
          },
        },
        yAxis: {
          title: {
            text: "Cases Count",
          },
        },
        colors: ["#040404", "#962129"],
        series: [
          {
            name: "<b>Positive Cases</b>",
            type: "column",
          },
          {
            name: "<b>Negative Cases</b>",
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

    const categories = graphData.map((item) => `${item.year}-${item.month}`);

    const chartOptions = {
      title: {
        text: "RVF Cases",
        align: "left",
      },
      legend: {
        itemMarginBottom: 10, // Adjust the margin size as needed
      },
      credits: { enabled: false },
      xAxis: {
        categories,
        title: { text: "Months" },
        labels: {
          style: {
            fontWeight: "bold", // Make x-axis labels bold
          },
        },
      },
      yAxis: {
        // allowDecimals: false,
        title: {
          text: "Cases Count",
        },
        labels: {
          style: {
            fontWeight: "bold",
          },
        },
      },
      plotOptions: {
        column: {
          stacking: "normal",
          threshold: null,
        },
      },
      colors: ["#040404", "#962129"],
      series: [
        {
          name: "<b>Positive Cases</b>",
          type: "column",
          data: categories.map((category, index) => {
            const graphDataMonth = category.split("-")[1];
            const graphDataYear = category.split("-")[0];

            const graphDataIndex = dates.findIndex(
              (date) =>
                date.split("-")[1] === graphDataMonth && date.split("-")[0] === graphDataYear
            );

            if (graphDataIndex !== -1 && data[graphDataIndex] >= meanRainfall) {
              return graphData[index].positive_cases;
            } else {
              return -graphData[index].positive_cases;
            }
          }),
          stack: "Europe",
        },
        {
          name: "<b>Negative Cases</b>",
          type: "column",
          data: categories.map((category, index) => {
            const graphDataMonth = category.split("-")[1];
            const graphDataYear = category.split("-")[0];

            const graphDataIndex = dates.findIndex(
              (date) =>
                date.split("-")[1] === graphDataMonth && date.split("-")[0] === graphDataYear
            );

            if (graphDataIndex !== -1 && data[graphDataIndex] < meanRainfall) {
              return -graphData[index].negative_cases;
            } else {
              return graphData[index].negative_cases;
            }
          }),
          stack: "Europe",
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
      tooltip: {
        formatter() {
          const isNegative = this.y < 0;
          const value = isNegative ? -this.y : this.y;
          return `<span>${this.x}</span><br/><span style="color:${this.series.color}">${this.series.name}: <b>${value}</b><br/>`;
        },
      },
    };

    if (chartRef.current) {
      Highcharts.chart(chartRef.current, chartOptions);
    }
  }, [graphData, graph_data, isLoader]);

  return <div ref={chartRef} />;
}

export default React.memo(CasesChart);
