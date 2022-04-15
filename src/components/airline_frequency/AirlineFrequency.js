import React, { useRef } from "react";
import { Bar } from "react-chartjs-2";
import { colorMap } from "../../constant";

function AirlineFrequency(props) {
  const chartRef = useRef(null);

  // const base64Image = chartRef.current.chartInstance.toBase64Image();
  // const handleClick = () => {
  //   const base64Image = chartRef.current.toBase64Image();
  //   const link = document.createElement("a");
  //   link.download = "chart.png";
  //   link.href = base64Image;
  //   link.click();
  // };

  const data = {
    labels: props?.data?.labelList,
    datasets: [
      {
        label: "Domestic",
        data: props?.data?.domDataList,
        backgroundColor: colorMap.orangeBackground,
        borderColor: colorMap.orangeBorder,
        borderWidth: 1,
      },
      {
        label: "International",
        data: props?.data?.intDataList,
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
        ref={chartRef}
        options={{
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Airline frequency",
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
                text: "Airline Name",
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

export default AirlineFrequency;
