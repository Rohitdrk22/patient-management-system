import React, { useState } from "react";
import Navbar from "./components/Navbar";
import AddPatient from "./components/AddPatient";
import ShowPatients from "./components/ShowPatients";
import DeletePatient from "./components/DeletePatient";
import Login from "./components/Login";
import "./components/Patients.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const [page, setPage] = useState("home");

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
          <h2 style={{ textAlign: "center" }}>
            Welcome to Patient Management System
          </h2>
        );
    }
  };

  return (
    <div>
      {isAuthenticated && (
        <Navbar
          setPage={setPage}
          page={page}
          onLogout={handleLogout}
        />
      )}

      <div className="container">{renderPage()}</div>
    </div>
  );
}

export default App;