import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import "antd/dist/antd.css";
import Chart from "chart.js/auto";

import { Menu } from "antd";
import { CalendarOutlined, LineChartOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import DailyReport from "./components/daily_report/DailyReport";
import OverallReport from "./components/overall_report/OverallReport";

function App() {
  const [currentTab, setCurrentTab] = useState(window.location.pathname);
  const navigate = useNavigate();

  return (
    <>
      <Menu
        onClick={(e) => {
          setCurrentTab(e.key);
          navigate(e.key);
        }}
        selectedKeys={[currentTab]}
        mode="horizontal"
        theme="dark"
      >
        <Menu.Item
          disabled
          style={{
            margin: "1%",
            color: "#08c",
            cursor: "text",
          }}
          key="/yyz"
        >
          <h2 style={{ color: "white" }}>Toronto Pearson Airport</h2>
        </Menu.Item>
        <Menu.Item
          key="/daily"
          icon={
            <CalendarOutlined style={{ fontSize: "30px", color: "#08c" }} />
          }
          style={{ margin: "1%" }}
        >
          Daily Performance Report
        </Menu.Item>
        <Menu.Item
          key="/"
          icon={
            <LineChartOutlined style={{ fontSize: "30px", color: "#08c" }} />
          }
          style={{ margin: "1%" }}
        >
          Overall Performance Report
        </Menu.Item>
      </Menu>
      <Routes>
        <Route path="/daily" element={<DailyReport />} />
        <Route exact path="/" element={<OverallReport />} />
      </Routes>
    </>
  );
}

export default App;
