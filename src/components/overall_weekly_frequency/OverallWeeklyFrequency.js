import React from "react";
import { Bar } from "react-chartjs-2";
import { colorMap } from "../../constant";

function OverallWeeklyFrequency(props) {
  const data = {
    labels: props?.data?.labelList,
    datasets: [
      {
        label: "Frequency",
        data: props?.data?.dataList,
        backgroundColor: colorMap.orangeBackground,
        borderColor: colorMap.orangeBorder,
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Bar
        data={data}
        options={{
          indexAxis: "y",
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Days wise flight frequency",
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
                text: "Avg. No. of flights",
              },
            },
            // y: {
            //   display: true,
            //   title: {
            //     display: true,
            //     text: "Day",
            //   },
            // },
          },
        }}
      />
    </>
  );
}

export default OverallWeeklyFrequency;
