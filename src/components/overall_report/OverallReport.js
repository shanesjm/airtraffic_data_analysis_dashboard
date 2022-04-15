import {
  Button,
  Card,
  Col,
  DatePicker,
  Row,
  Space,
  Spin,
  Statistic,
} from "antd";
import React, { useEffect, useState } from "react";

import AirlineFrequency from "../airline_frequency/AirlineFrequency";
import OverallFlightFrequency from "../overall_flight_frequency/OverallFlightFrequency";
import OverallHourlyFrequency from "../overall_hourly_frequency/OverallHourlyFrequency";
import OverallWeeklyFrequency from "../overall_weekly_frequency/OverallWeeklyFrequency";
import Terminal from "../terminal/Terminal";

import moment from "moment";
import { hourMap, weekMap } from "../../constant";
const defaultStartDate = moment("2021-12-01", "Y-MM-DD");
const defaultEndDate = moment().subtract(1, "days");

function OverallReport() {
  const [loading, setLoading] = useState(false);
  const [domesticData, setDomesticData] = useState({});
  const [internationalData, setInternationalData] = useState({});
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [dayWiseData, setDayWiseData] = useState({});
  const [hourlyData, setHourlyData] = useState({});
  const [weeklyFreqData, setWeeklyFreqData] = useState({});
  const [airlineFreqData, setAirlineFreqData] = useState({});
  const [arrTerminalData, setArrTerminalData] = useState({});

  useEffect(() => {
    setLoading(true);
    getDashboardData().then(
      (response) => {
        setLoading(false);
      },
      (err) => {
        console.log(err);
        setLoading(false);
      }
    );
  }, []);

  const getDashboardData = () => {
    return getCardData().then(
      (response) => {
        return getAndSetData().then(
          (response) => {
            return getDayWiseFreq().then(
              (response) => {},
              (err) => {
                console.log(err);
                setLoading(false);
              }
            );
          },
          (err) => {
            setLoading(false);
          }
        );
      },
      (err) => {
        console.log(err);
        setLoading(false);
      }
    );
  };

  const getDayWiseFreq = async () => {
    const start = startDate.format("Y-MM-DD");
    const end = endDate.format("Y-MM-DD");
    const domesticResult = await fetch(
      `https://us-central1-capstone-342021.cloudfunctions.net/get_overall_daily_domestic_frequency_o?startDate=${start}&endDate=${end}`
    ).then((response) => response.json());

    const internationaResult = await fetch(
      `https://us-central1-capstone-342021.cloudfunctions.net/get_overall_daily_international_frequency_o?startDate=${start}&endDate=${end}`
    ).then((response) => response.json());

    const tempLabelList = [];
    const tempDomesticList = [];
    const tempInternationaList = [];

    domesticResult.forEach((element, index) => {
      tempLabelList.push(element.flight_date.split("T")[0]);
      tempDomesticList.push(element.count);
      tempInternationaList.push(internationaResult[index].count);
    });

    setDayWiseData({
      labelList: tempLabelList,
      domesticList: tempDomesticList,
      internationalList: tempInternationaList,
    });
  };

  const getCardData = async () => {
    const start = startDate.format("Y-MM-DD");
    const end = endDate.format("Y-MM-DD");
    return fetch(
      `https://us-central1-capstone-342021.cloudfunctions.net/get_overall_card_domestic_d?startDate=${start}&endDate=${end}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.length) {
            setDomesticData({
              numberOfFlights: result[0].numberOfFlights,
              cancelled: result[0].cancelled,
              arrivalDelay: result[0].arrivalDelay,
              departureDelay: result[0].departureDelay,
            });
          }
          fetch(
            `https://us-central1-capstone-342021.cloudfunctions.net/get_overall_card_international_d?startDate=${start}&endDate=${end}`
          )
            .then((res) => res.json())
            .then(
              (result) => {
                if (result.length) {
                  setInternationalData({
                    numberOfFlights: result[0].numberOfFlights,
                    cancelled: result[0].cancelled,
                    arrivalDelay: result[0].arrivalDelay,
                    departureDelay: result[0].departureDelay,
                  });
                }
              },

              (err) => {
                setLoading(false);
              }
            );
        },

        (err) => {
          setLoading(false);
        }
      );
  };

  const getAndSetData = async () => {
    const start = startDate.format("Y-MM-DD");
    const end = endDate.format("Y-MM-DD");

    const oHourlyLabel = [];
    const oHourlyArrival = [];
    const oHourlyDeparture = [];

    const oWeekyLabelList = [];
    const oWeekyDataList = [];

    const oAirlineLabel = [];
    const oAirlineIntData = [];
    const oAirlineDomData = [];

    let arrTermLabelList = [];
    let arrTermDataList = [];

    let [
      oHourlyArrivalFreq,
      oHourlyDepartureFreq,
      oWeeklyFreqResp,
      oAirlinesResp,
      arrTerminalResp,
      departTerminalRes,
    ] = await Promise.all([
      fetch(
        `https://us-central1-capstone-342021.cloudfunctions.net/get_hourly_frequency_distribution_arrival_o?startDate=${start}&endDate=${end}`
      ).then((response) => response.json()),
      fetch(
        `https://us-central1-capstone-342021.cloudfunctions.net/get_hourly_frequency_distribution_departure_o?startDate=${start}&endDate=${end}`
      ).then((response) => response.json()),
      fetch(
        `https://us-central1-capstone-342021.cloudfunctions.net/get_weekdays_frequency_o?startDate=${start}&endDate=${end}`
      ).then((response) => response.json()),
      fetch(
        `https://us-central1-capstone-342021.cloudfunctions.net/get_top_n_airlines_by_frequency_split_is_domestic_o?limit=5&startDate=${start}&endDate=${end}`
      ).then((response) => response.json()),
      fetch(
        `https://us-central1-capstone-342021.cloudfunctions.net/get_top_n_arrival_terminal_o?limit=5&startDate=${start}&endDate=${end}`
      ).then((response) => response.json()),
      fetch(
        `https://us-central1-capstone-342021.cloudfunctions.net/get_top_n_departure_terminal_o?limit=5&startDate=${start}&endDate=${end}`
      ).then((response) => response.json()),
    ]);

    oHourlyArrivalFreq = oHourlyArrivalFreq.sort((a, b) => a.hour - b.hour);
    oHourlyDepartureFreq = oHourlyDepartureFreq.sort((a, b) => a.hour - b.hour);

    oHourlyArrivalFreq.forEach((element, index) => {
      oHourlyLabel.push(hourMap[element.hour]);
      oHourlyArrival.push(element.avg);
      oHourlyDeparture.push(oHourlyDepartureFreq[index].avg);
    });

    oWeeklyFreqResp = oWeeklyFreqResp.sort((a, b) => a.weekDay - b.weekDay);

    oWeeklyFreqResp.forEach((element) => {
      oWeekyLabelList.push(weekMap[element.weekDay]);
      oWeekyDataList.push(element.avg);
    });

    oAirlinesResp.forEach((element) => {
      if (element.is_domestic) {
        oAirlineDomData.push(element.count);
      } else {
        oAirlineIntData.push(element.count);
      }
      oAirlineLabel.push(element.airline_name);
    });

    arrTerminalResp.forEach((element) => {
      arrTermLabelList.push(element.arrival_terminal);
      arrTermDataList.push(element.count);
    });

    departTerminalRes.forEach((el) => {
      if (!arrTermLabelList.includes(el.departure_terminal)) {
        arrTermLabelList.push(el.departure_terminal);
        arrTermDataList.push(el.count);
      }
    });

    arrTermDataList = arrTermDataList.sort((a, b) => a.count - b.count);

    //   setters
    setHourlyData({
      labelList: oHourlyLabel,
      arrivalDataList: oHourlyArrival,
      departureDataList: oHourlyDeparture,
    });

    setWeeklyFreqData({
      labelList: oWeekyLabelList,
      dataList: oWeekyDataList,
    });

    setAirlineFreqData({
      labelList: [...new Set(oAirlineLabel)],
      domDataList: oAirlineDomData,
      intDataList: oAirlineIntData,
    });

    setArrTerminalData({
      labelList: arrTermLabelList,
      dataList: arrTermDataList,
    });
  };

  const handleClick = () => {
    setLoading(true);

    getDashboardData().then(
      (response) => {
        setLoading(false);
      },
      (err) => {
        console.log(err);
        setLoading(false);
      }
    );
  };

  return (
    <Spin spinning={loading} size="large">
      <div style={{ margin: "2%" }}>
        <Card>
          <Row>
            <Space>
              <h3>Performance Report from :</h3>
              <DatePicker
                defaultValue={startDate}
                onChange={(e) => {
                  setStartDate(e);
                }}
              />
              <h3>To :</h3>
              <DatePicker
                defaultValue={endDate}
                onChange={(e) => {
                  setEndDate(e);
                }}
              />
              <Button
                type="primary"
                size={"large"}
                onClick={() => {
                  handleClick();
                }}
              >
                Generate Report
              </Button>
            </Space>
          </Row>
        </Card>
        <Card>
          <Row gutter={[20, 10]}>
            <Col span={12}>
              <Card style={{ border: "1px solid" }}>
                <Space>
                  <h2>Domestic Flights:</h2>
                  <h2>{domesticData.numberOfFlights}</h2>
                </Space>
              </Card>
            </Col>
            <Col span={12}>
              <Card style={{ border: "1px solid" }}>
                <Space>
                  <h2>International Flights:</h2>
                  <h2>{internationalData.numberOfFlights}</h2>
                </Space>
              </Card>
            </Col>
            <Col span={4}>
              <Card style={{ border: "1px solid" }}>
                <Statistic
                  title={<h3>Cancelled Flights</h3>}
                  value={domesticData.cancelled}
                  // precision={2}
                  valueStyle={{ color: "#d55e00" }}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card style={{ border: "1px solid" }}>
                <Statistic
                  title={<h3>Avg. Delay (arrival)</h3>}
                  value={domesticData.arrivalDelay}
                  precision={2}
                  valueStyle={{ color: "#d55e00" }}
                  suffix={"mins"}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card style={{ border: "1px solid" }}>
                <Statistic
                  title={<h3>Avg. Delay (departure)</h3>}
                  value={domesticData.departureDelay}
                  precision={2}
                  valueStyle={{ color: "#d55e00" }}
                  suffix={"mins"}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card style={{ border: "1px solid" }}>
                <Statistic
                  title={<h3>Cancelled Flights</h3>}
                  value={internationalData.cancelled}
                  // precision={2}
                  valueStyle={{ color: "#d55e00" }}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card style={{ border: "1px solid" }}>
                <Statistic
                  title={<h3>Avg. Delay (arrival)</h3>}
                  value={internationalData.arrivalDelay}
                  precision={2}
                  valueStyle={{ color: "#d55e00" }}
                  suffix={"mins"}
                />
              </Card>
            </Col>
            <Col span={4}>
              <Card style={{ border: "1px solid" }}>
                <Statistic
                  title={<h3>Avg. Delay (departure)</h3>}
                  value={internationalData.arrivalDelay}
                  precision={2}
                  valueStyle={{ color: "#d55e00" }}
                  suffix={"mins"}
                />
              </Card>
            </Col>
          </Row>
        </Card>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col
            className="gutter-row"
            span={12}
            style={{ height: "400px", border: "1px solid" }}
          >
            <AirlineFrequency data={airlineFreqData} />
          </Col>
          <Col
            className="gutter-row"
            span={12}
            style={{ height: "400px", border: "1px solid" }}
          >
            <OverallWeeklyFrequency data={weeklyFreqData} />
          </Col>
          <Col
            className="gutter-row"
            span={12}
            style={{ height: "400px", border: "1px solid" }}
          >
            <OverallHourlyFrequency data={hourlyData} />
          </Col>
          <Col
            className="gutter-row"
            span={12}
            style={{ height: "400px", border: "1px solid" }}
          >
            <Terminal data={arrTerminalData} />
          </Col>
          <Col
            className="gutter-row"
            span={24}
            style={{ height: "400px", border: "1px solid" }}
          >
            <OverallFlightFrequency data={dayWiseData} />
          </Col>
        </Row>
      </div>
    </Spin>
  );
}

export default OverallReport;
