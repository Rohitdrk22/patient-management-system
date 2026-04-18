import React, { useState } from "react";
// import axios from "axios";
import api from "../api/axios";
import "./Patients.css";

const ShowPatients = () => {
  const [patients, setPatients] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePatients = async () => {
  try {
    setError("");

    if (!show) {
      setLoading(true);
      const res = await api.get("/api/patients"); // ✅ interceptor used
      setPatients(res.data || []);
    }

    setShow((prev) => !prev);
  } catch (err) {
    console.error(err);
    setError("❌ Failed to fetch patients");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="container">
      <h2 className="title">Patient Management</h2>

      <button className="btn show-btn" onClick={togglePatients}>
        {show ? "Hide Patients" : "Show All Patients"}
      </button>

      {show && (
        <div className="card">
          <h3>Patient Records</h3>

          {loading ? (
            <p className="no-data">Loading...</p>
          ) : error ? (
            <p className="no-data">{error}</p>
          ) : patients.length === 0 ? (
            <p className="no-data">No patients found</p>
          ) : (
            <div className="table-wrapper"> {/* ✅ IMPORTANT FIX */}
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>DOB</th>
                  </tr>
                </thead>

                <tbody>
                  {patients.map((p) => (
                    <tr key={p.id}>
                      <td title={p.id}>{p.id}</td> {/* hover full ID */}
                      <td>{p.name}</td>
                      <td>{p.email}</td>
                      <td>{p.address}</td>
                      <td>{p.dateOfBirth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ShowPatients;