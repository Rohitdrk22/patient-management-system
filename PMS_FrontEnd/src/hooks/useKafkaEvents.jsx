import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";

const useKafkaEvents = (setLastEvent, setStats) => {
  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:4004/ws",
      reconnectDelay: 5000,

      onConnect: () => {
        console.log("✅ Connected to WebSocket");

        client.subscribe("/topic/patient-events", (message) => {
          const data = JSON.parse(message.body);

          console.log("🔥 Event received:", data);

          const value =
            data.eventType === "PATIENT_CREATED"
              ? `Added ${data.name}`
              : `Deleted ${data.name}`;

          // ✅ Last Activity
          if (setLastEvent) {
            setLastEvent(value);
            localStorage.setItem("lastEvent", value);
          }

          // ✅ REAL-TIME STATS UPDATE
          if (setStats) {
            setStats((prev) => {
              let newTotal = prev.total;
              let newToday = prev.today;

              if (data.eventType === "PATIENT_CREATED") {
                newTotal += 1;
                newToday += 1;
              } else if (data.eventType === "PATIENT_DELETED") {
                newTotal -= 1;
              }

              return {
                total: newTotal,
                today: newToday,
              };
            });
          }

          // ✅ Toasts
          if (data.eventType === "PATIENT_CREATED") {
            toast.success(
            <div>
              <strong>Patient Created ✅</strong>
              <div>👤 {data.name}</div>
              <div>📧 {data.email}</div>
              <div>🆔 {data.patientId}</div>
            </div>,
            { toastId: data.patientId + "-created" }
          );
          } else if (data.eventType === "PATIENT_DELETED") {
            toast.error(
          <div>
            <strong>Patient Deleted ❌</strong>
            <div>👤 {data.name}</div>
            <div>🆔 {data.patientId}</div>
          </div>,
        { toastId: data.patientId + "-deleted" }
      );
          }
        });
      },
    });

    client.activate();
    return () => client.deactivate();
  }, [setLastEvent, setStats]);
};

export default useKafkaEvents;