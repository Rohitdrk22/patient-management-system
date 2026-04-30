import React, { useEffect, useState } from "react";
import Login from "./components/Login";
import ShowPatients from "./components/ShowPatients";
import useKafkaEvents from "./hooks/useKafkaEvents";
import api from "./api/axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Dashboard from "./components/Dashboard";
import ActivityFeed from "./components/ActivityFeed";

import "./components/Patients.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const [page, setPage] = useState("dashboard");

  const [stats, setStats] = useState({
    total: 0,
    today: 0,
  });

  const [events, setEvents] = useState([]);
  const [lastEvent, setLastEvent] = useState(
    localStorage.getItem("lastEvent") || ""
  );

  // 🔥 REAL-TIME EVENTS
  useKafkaEvents((event) => {
    setLastEvent(event);

    // store last 10 events
    setEvents((prev) => [event, ...prev.slice(0, 9)]);

    // 🔔 notification
    toast.info(event);
  }, setStats);

  // 📊 Initial data load
  useEffect(() => {
    if (!isAuthenticated) return;

    api.get("/api/patients").then((res) => {
      const patients = res.data || [];
      const today = new Date().toISOString().split("T")[0];

      const todayCount = patients.filter(
        (p) =>
          p.registeredDate &&
          new Date(p.registeredDate).toISOString().split("T")[0] === today
      ).length;

      setStats({
        total: patients.length,
        today: todayCount,
      });
    });
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="login-page">
        <Login onLoginSuccess={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div className="app">
      <ToastContainer position="top-right" />

      {/* SIDEBAR */}
      <div className="sidebar">
        <h2>🏥 HMS</h2>

        <button
          className={page === "dashboard" ? "active" : ""}
          onClick={() => setPage("dashboard")}
        >
          Dashboard
        </button>

        <button
          className={page === "patients" ? "active" : ""}
          onClick={() => setPage("patients")}
        >
          Patients
        </button>
      </div>

      {/* MAIN */}
      <div className="main">
        <div className="topbar">
          <span>Hospital Management System</span>
          <button onClick={handleLogout}>Logout</button>
        </div>

        <div className="dashboard">
          {page === "dashboard" && (
            <>
              <Dashboard stats={stats} />
              <ActivityFeed events={events} />
            </>
          )}

          {page === "patients" && <ShowPatients />}
        </div>
      </div>
    </div>
  );
}

export default App;