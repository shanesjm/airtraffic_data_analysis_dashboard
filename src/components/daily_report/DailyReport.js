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
import moment from "moment";
import Terminal from "../terminal/Terminal";

const defaultReportDate = moment().subtract(1, "days");

function DailyReport() {
  const [loading, setLoading] = useState(false);
  const [reportDate, setReportDate] = useState(defaultReportDate);
  const [domesticData, setDomesticData] = useState({});
  const [internationalData, setInternationalData] = useState({});
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
            console.log(response);
          },
          (err) => {
            console.log(err);
            // setLoading(false);
          }
        );
      },
      (err) => {
        console.log(err);
        // setLoading(false);
      }
    );
  };

  const getAndSetData = async () => {
    const date = reportDate.format("Y-MM-DD");
    const oAirlineLabel = [];
    const oAirlineIntData = [];
    const oAirlineDomData = [];
    let arrTermLabelList = [];
    let arrTermDataList = [];
    try {
      let [
        // oHourlyArrivalFreq,
        // oHourlyDepartureFreq,
        // oWeeklyFreqResp,
        oAirlinesResp,
        arrTerminalResp,
        departTerminalRes,
      ] = await Promise.all([
        fetch(
          `https://us-central1-capstone-342021.cloudfunctions.net/get_top_n_airlines_daily_by_frequency_split_is_domestic_d?limit=5&date=${date}`
        ).then((response) => response.json()),
        fetch(
          `https://us-central1-capstone-342021.cloudfunctions.net/get_daily_top_n_arrival_terminal_d?limit=5&date=${date}`
        ).then((response) => response.json()),
        fetch(
          `https://us-central1-capstone-342021.cloudfunctions.net/get_top_n_daily_departure_terminal_d?limit=5&date=${date}`
        ).then((response) => response.json()),
      ]);

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

      setAirlineFreqData({
        labelList: [...new Set(oAirlineLabel)],
        domDataList: oAirlineDomData,
        intDataList: oAirlineIntData,
      });
      setArrTerminalData({
        labelList: arrTermLabelList,
        dataList: arrTermDataList,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const getCardData = async () => {
    const date = reportDate.format("Y-MM-DD");

    return fetch(
      `https://us-central1-capstone-342021.cloudfunctions.net/get_daily_card_domestic_d?date=${date}`
    )
      .then((res) => res.json())
      .then(
        (result) => {
          if (result.length) {
            setDomesticData({
              numberOfFlights: result[0].noOfFlights,
              cancelled: result[0].cancelled,
              arrivalDelay: result[0].arrivalDelay,
              departureDelay: result[0].departureDelay,
            });
          }
          fetch(
            `https://us-central1-capstone-342021.cloudfunctions.net/get_daily_card_international_d?date=${date}`
          )
            .then((res) => res.json())
            .then(
              (result) => {
                if (result.length) {
                  setInternationalData({
                    numberOfFlights: result[0].noOfFlights,
                    cancelled: result[0].cancelled,
                    arrivalDelay: result[0].arrivalDelay,
                    departureDelay: result[0].departureDelay,
                  });
                }
              },

              (error) => {}
            );
        },

        (error) => {}
      );
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
              <h3>Daily Performance Report for :</h3>
              <DatePicker
                defaultValue={reportDate}
                onChange={(e) => {
                  setReportDate(e);
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
            <Terminal data={arrTerminalData} />
          </Col>
        </Row>
      </div>
    </Spin>
  );
}

export default DailyReport;
