import React, { useEffect, useState } from "react";
import api from "../api/axios";
import AddPatient from "./AddPatient";

function ShowPatients() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPatients = () => {
    api.get("/api/patients").then((res) => {
      setPatients(res.data || []);
    });
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const filtered = patients
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    )
    .filter((p) =>
      filter === "ALL" ? true : p.status === filter
    );

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/api/patients/${deleteId}`);
      setDeleteId(null);
      fetchPatients();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };
  

  return (
    <>
      {/* 🔍 Search + Filter */}
      <div className="actions">
        <input
          placeholder="Search patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All</option>
          <option value="ADMITTED">Admitted</option>
          <option value="DISCHARGED">Discharged</option>
          <option value="CRITICAL">Critical</option>
        </select>

        <button
          className="primary"
          onClick={() => setShowModal(true)}
        >
          + Add Patient
        </button>
      </div>

      {/* 📋 Table */}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Condition</th>
            <th>Status</th>
            <th>Registered</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
  {filtered.length === 0 ? (
    <tr>
      <td colSpan="5">No patients found</td>
    </tr>
  ) : (
    filtered.map((p) => (
      <tr key={p.id}>
        <td>{p.name}</td>

        <td>{p.condition || "N/A"}</td>

        <td>
          <span className={`badge ${p.status?.toLowerCase()}`}>
            {p.status || "N/A"}
          </span>
        </td>

        {/* ✅ FIXED DATE */}
        <td>
          {p.registeredDate
            ? (() => {
                const [y, m, d] = p.registeredDate.split("-");
                return `${d}-${m}-${y}`;
              })()
            : "N/A"}
        </td>

        {/* 🗑️ Delete */}
        <td>
          <span
            className="delete-icon"
            onClick={() => setDeleteId(p.id)}
          >
            🗑️
          </span>
        </td>
      </tr>
    ))
  )}
</tbody>
      </table>

      {/* ➕ Add Patient Modal */}
      {showModal && (
        <AddPatient
          onSuccess={() => {
            fetchPatients();
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* ❌ Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="confirm-card">
            <h3>Delete Patient</h3>

            <p>
              Are you sure you want to delete this patient?
            </p>

            <div className="modal-footer">
              <button
                className="secondary"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>

              <button
                className="danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ShowPatients;