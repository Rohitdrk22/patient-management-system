import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const Dashboard = ({ stats, events = [] }) => {
  // 📊 Mock weekly data (you can replace with API later)
  const data = [
    { day: "Mon", count: 10 },
    { day: "Tue", count: 15 },
    { day: "Wed", count: 8 },
    { day: "Thu", count: 20 },
    { day: "Fri", count: 18 },
    { day: "Sat", count: 12 },
    { day: "Sun", count: 22 },
  ];

  return (
    <div className="dashboard-container">
      
      {/* ================= KPI CARDS ================= */}
      <div className="stats">
        <div className="stat-card">
          <h4>Total Patients</h4>
          <p>
            {stats.total}
            <span className="trend up"> ↑ 8%</span>
          </p>
        </div>

        <div className="stat-card">
          <h4>New Today</h4>
          <p>
            {stats.today}
            <span className="trend up"> ↑ 3%</span>
          </p>
        </div>

        <div className="stat-card">
          <h4>Critical Cases</h4>
          <p>
            {stats.critical || 0}
            <span className="trend down"> ↓ 2%</span>
          </p>
        </div>

        <div className="stat-card">
          <h4>Discharged</h4>
          <p>{stats.discharged || 0}</p>
        </div>
      </div>

      {/* ================= CHART ================= */}
      <div className="stat-card">
        <h4>Weekly Patient Analytics</h4>

        <LineChart width={600} height={250} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#4f46e5" />
        </LineChart>
      </div>

      {/* ================= BOTTOM GRID ================= */}
      <div className="bottom-grid">
        
        {/* 🔴 ACTIVITY FEED */}
        <div className="stat-card">
          <h4>Live Activity</h4>

          {events.length === 0 ? (
            <p>No activity yet 🚀</p>
          ) : (
            events.map((e, i) => (
              <div key={i} className="activity-item">
                🔴 {e}
              </div>
            ))
          )}
        </div>

        {/* 🟢 SYSTEM STATUS */}
        <div className="stat-card">
          <h4>System Status</h4>

          <ul className="status-list">
            <li>API: 🟢 Online</li>
            <li>Kafka: 🟢 Connected</li>
            <li>Database: 🟢 Healthy</li>
          </ul>

          <p className="last-updated">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;