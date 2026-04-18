import React, { useState } from "react";
import api from "../api/axios";
import "./Patients.css";

const DeletePatient = () => {
  const [patientId, setPatientId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const deletePatient = async () => {
    if (!patientId) {
      setMessage("❌ Please enter Patient ID");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      // await axios.delete(`http://localhost:4004/api/patients/${patientId}`);
      await api.delete(`/api/patients/${patientId}`);

      setMessage("✅ Patient deleted successfully");
      setPatientId("");

    } catch (err) {
      console.error(err);

      if (err.response) {
        setMessage("❌ " + (err.response.data.message || "Delete failed"));
      } else {
        setMessage("❌ Server not reachable");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3>Delete Patient</h3>

      {message && <p>{message}</p>}

      <input
        type="text"
        placeholder="Enter Patient ID"
        value={patientId}
        onChange={(e) => setPatientId(e.target.value)}
      />

      <button
        className="btn danger"
        onClick={deletePatient}
        disabled={loading}
      >
        {loading ? "Deleting..." : "Delete Patient"}
      </button>
    </div>
  );
};

export default DeletePatient;