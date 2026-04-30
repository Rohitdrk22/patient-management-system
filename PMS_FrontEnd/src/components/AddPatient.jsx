import React, { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const AddPatient = ({ onSuccess, onClose }) => {
  const getTodayDate = () =>
    new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    dateOfBirth: "",
    condition: "",
    status: "ADMITTED",
    registeredDate: getTodayDate()
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addPatient = async () => {
    try {
      setLoading(true);

      await api.post("/api/patients", form);

      // ✅ SUCCESS TOAST
      toast.success("Patient added successfully ✅");

      onSuccess();   // refresh list
      onClose();     // close modal

    } catch (err) {
      console.error(err);

      // ✅ ERROR TOAST
      if (err.response) {
        toast.error(err.response.data?.message || "Failed to add patient ❌");
      } else {
        toast.error("Server not reachable ❌");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <h3>Add Patient</h3>
          <span className="close-btn" onClick={onClose}>✖</span>
        </div>

        {/* Body */}
        <div className="modal-body">
          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="address" placeholder="Address" onChange={handleChange} />

          <input type="date" name="dateOfBirth" onChange={handleChange} />

          <input
            name="condition"
            placeholder="Condition (e.g. Fever)"
            onChange={handleChange}
          />

          <select name="status" onChange={handleChange}>
            <option value="ADMITTED">Admitted</option>
            <option value="DISCHARGED">Discharged</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="secondary" onClick={onClose}>
            Cancel
          </button>

          <button className="primary" onClick={addPatient} disabled={loading}>
            {loading ? "Saving..." : "Save Patient"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;