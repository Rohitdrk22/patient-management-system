import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

const Dashboard = ({ stats }) => {
  const data = [
    { name: "Today", count: stats.today },
    { name: "Total", count: stats.total },
  ];

  return (
    <>
      <div className="stats">
        <div className="stat-card">
          <h4>Total Patients</h4>
          <p>{stats.total}</p>
        </div>

        <div className="stat-card">
          <h4>New Today</h4>
          <p>{stats.today}</p>
        </div>
      </div>

      <div className="stat-card">
        <h4>Patient Analytics</h4>
        <LineChart width={400} height={200} data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" />
        </LineChart>
      </div>
    </>
  );
};

export default Dashboard;