import React from "react";
import { Bar } from "react-chartjs-2";
import { colorMap } from "../../constant";

function Terminal(props) {
  const data = {
    labels: props?.data?.labelList,
    datasets: [
      {
        label: "Terminal",
        data: props?.data?.dataList,
        backgroundColor: colorMap.greenBackground,
        borderColor: colorMap.greenBorder,
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Bar
        data={data}
        options={{
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Terminal Frequency",
            },
            legend: {
              display: false,
              position: "bottom",
            },
          },
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: "Terminal",
              },
            },
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

export default Terminal;
