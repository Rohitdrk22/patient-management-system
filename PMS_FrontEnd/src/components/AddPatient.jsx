import React, { useState } from "react";
import api from "../api/axios";
import "./Patients.css";

const AddPatient = () => {

  // ✅ helper to get today's date in YYYY-MM-DD
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  // ✅ state with auto-filled registeredDate
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    dateOfBirth: "",
    registeredDate: getTodayDate()
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addPatient = async () => {
    try {
      setLoading(true);
      setMessage("");

      await api.post("/api/patients", form);

      setMessage("✅ Patient added successfully");

      // ✅ reset form but keep today's date
      setForm({
        name: "",
        email: "",
        address: "",
        dateOfBirth: "",
        registeredDate: getTodayDate()
      });

    } catch (err) {
  console.error("FULL ERROR:", err.response?.data);
  setMessage("❌ " + JSON.stringify(err.response?.data));


      if (err.response) {
        setMessage("❌ " + (err.response.data.message || "Error adding patient"));
      } else {
        setMessage("❌ Server not reachable");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Add Patient</h3>

      {message && <p className="no-data">{message}</p>}

      {/* Name */}
      <label>Name</label>
      <input
        name="name"
        placeholder="Enter name"
        value={form.name}
        onChange={handleChange}
      />

      {/* Email */}
      <label>Email</label>
      <input
        name="email"
        placeholder="Enter email"
        value={form.email}
        onChange={handleChange}
      />

      {/* Address */}
      <label>Address</label>
      <input
        name="address"
        placeholder="Enter address"
        value={form.address}
        onChange={handleChange}
      />

      {/* DOB */}
      <label>Date of Birth</label>
      <input
        name="dateOfBirth"
        type="date"
        value={form.dateOfBirth}
        onChange={handleChange}
      />

      {/* Registered Date (auto-filled) */}
      <label>Registered Date</label>
      <input
        name="registeredDate"
        type="date"
        value={form.registeredDate}
        onChange={handleChange} // you can remove this if you want it locked
      />

      <button
        className="btn success"
        onClick={addPatient}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add Patient"}
      </button>
    </div>
  );
};

export default AddPatient;