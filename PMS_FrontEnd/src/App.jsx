import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import AddPatient from "./components/AddPatient";
import ShowPatients from "./components/ShowPatients";
import DeletePatient from "./components/DeletePatient";
import Login from "./components/Login";
import api from "./api/axios";
import "./components/Patients.css";

import useKafkaEvents from "./hooks/useKafkaEvents";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const [page, setPage] = useState("home");

  // 📊 Dashboard states
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
  });

  const [lastEvent, setLastEvent] = useState(
    localStorage.getItem("lastEvent") || ""
  );

  // 🔥 WebSocket listener (REAL-TIME updates)
  useKafkaEvents(setLastEvent, setStats);

  // 📊 Initial fetch (BASE DATA)
  useEffect(() => {
    if (isAuthenticated) {
      api
        .get("/api/patients")
        .then((res) => {
          const patients = res.data || [];

          const today = new Date().toISOString().split("T")[0];

          const todayCount = patients.filter((p) => {
            if (!p.registeredDate) return false;

            return (
              new Date(p.registeredDate)
                .toISOString()
                .split("T")[0] === today
            );
          }).length;

          setStats({
            total: patients.length,
            today: todayCount,
          });
        })
        .catch((err) => {
          console.error("Error fetching stats", err);
        });
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setPage("home");
    setIsAuthenticated(false);
  };

  const renderPage = () => {
    if (!isAuthenticated) {
      return <Login key="login" onLoginSuccess={handleLoginSuccess} />;
    }

    switch (page) {
      case "show":
        return <ShowPatients />;

      case "add":
        return <AddPatient />;

      case "delete":
        return <DeletePatient />;

      default:
        return (
          <div className="dashboard">
            <h2>🏥 Patient Management Dashboard</h2>

            {/* 📊 Stats Cards */}
            <div className="cards">
              <div className="card stat">
                <h3>Total Patients</h3>
                <p>{stats.total}</p>
              </div>

              <div className="card stat">
                <h3>New Today</h3>
                <p>{stats.today}</p>
              </div>

              <div className="card stat">
                <h3>Last Activity</h3>
                <p>{lastEvent || "No activity yet"}</p>
              </div>
            </div>

            {/* ⚡ Quick Actions */}
            <div className="actions">
              <button onClick={() => setPage("add")}>
                ➕ Add Patient
              </button>

              <button onClick={() => setPage("show")}>
                📋 View Patients
              </button>

              <button onClick={() => setPage("delete")}>
                ❌ Delete Patient
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      {/* 🔥 Toast */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Navbar */}
      {isAuthenticated && (
        <Navbar
          setPage={setPage}
          page={page}
          onLogout={handleLogout}
        />
      )}

      {/* Page Content */}
      <div className="container">{renderPage()}</div>
    </div>
  );
}

export default App;