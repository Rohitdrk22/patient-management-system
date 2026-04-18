import React from "react";
import "./Navbar.css";

const Navbar = ({ setPage, page, onLogout }) => {

  const handleLogout = () => {
  localStorage.removeItem("token");
  setPage("home");              // reset page
  setIsAuthenticated(false);    // trigger login view
};

  return (
    <nav className="navbar">
      <h2 className="logo">PMS</h2>

      <div className="nav-links">
        <button
          className={page === "home" ? "active" : ""}
          onClick={() => setPage("home")}
        >
          Home
        </button>

        <button
          className={page === "show" ? "active" : ""}
          onClick={() => setPage("show")}
        >
          View Patients
        </button>

        <button
          className={page === "add" ? "active" : ""}
          onClick={() => setPage("add")}
        >
          Add Patient
        </button>

        <button
          className={page === "delete" ? "active" : ""}
          onClick={() => setPage("delete")}
        >
          Delete Patient
        </button>

        {/* 🔴 Logout Button */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;