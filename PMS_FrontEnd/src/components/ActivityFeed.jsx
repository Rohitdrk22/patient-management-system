import React from "react";

const ActivityFeed = ({ events }) => {
  return (
    <div className="stat-card">
      <h4>Live Activity</h4>

      {events.length === 0 ? (
        <p>No activity yet</p>
      ) : (
        events.map((e, i) => (
          <div key={i} className="activity-item">
            🔴 {e}
          </div>
        ))
      )}
    </div>
  );
};

export default ActivityFeed;