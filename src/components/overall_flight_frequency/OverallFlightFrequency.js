import React from "react";
import { Bar, Line } from "react-chartjs-2";
// import Chart from "chart.js/auto";
import { colorMap } from "../../constant";

function OverallFlightFrequency(props) {
  const data = {
    labels: props?.data?.labelList,
    datasets: [
      {
        label: "Domestic",
        data: props?.data?.domesticList,
        backgroundColor: colorMap.orangeBackground,
        borderColor: colorMap.orangeBorder,
        borderWidth: 1,
      },
      {
        label: "International",
        data: props?.data?.internationalList,
        backgroundColor: colorMap.greenBackground,
        borderColor: colorMap.greenBorder,
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Line
        data={data}
        options={{
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Daywise Flight frequency",
            },
            legend: {
              display: true,
            },
          },
          scales: {
            // x: {
            //   display: true,
            //   title: {
            //     display: true,
            //     text: "Date",
            //   },
            // },
            y: {
              display: true,
              title: {
                display: true,
                text: "Total No. of flights",
              },
            },
          },
        }}
      />
    </>
  );
}

export default OverallFlightFrequency;
