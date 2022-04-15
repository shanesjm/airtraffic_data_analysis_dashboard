import React from "react";
import { Line } from "react-chartjs-2";
import { colorMap } from "../../constant";

function OverallHourlyFrequency(props) {
  const data = {
    labels: props?.data?.labelList,
    datasets: [
      {
        label: "Landing",
        data: props?.data?.arrivalDataList,
        backgroundColor: colorMap.orangeBackground,
        borderColor: colorMap.orangeBorder,
        borderWidth: 1,
      },
      {
        label: "Takeoff",
        data: props?.data?.departureDataList,
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
              text: `Hourly Landing/Takeoff Frequency`,
            },
            legend: {
              display: true,
              position: "top",
            },
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: "Time",
              },
            },
            y: {
              display: true,
              title: {
                display: true,
                text: "Avg. No. of flights",
              },
            },
          },
        }}
      />
    </>
  );
}

export default OverallHourlyFrequency;
