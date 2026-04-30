import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { toast } from "react-toastify";

const useKafkaEvents = (setLastEvent, setStats, onNewEvent) => {
  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:4004/ws",
      reconnectDelay: 5000,
      debug: (str) => console.log("STOMP:", str),

      onConnect: () => {
        console.log("✅ Connected to WebSocket");

        const subscription = client.subscribe(
          "/topic/patient-events",
          (message) => {
            if (!message.body) return;

            try {
              const data = JSON.parse(message.body);

              console.log("🔥 Event received:", data);

              // ✅ 🔥 SEND EVENT TO UI (IMPORTANT)
              if (onNewEvent) {
                onNewEvent(data);
              }

              const value =
                data.eventType === "PATIENT_CREATED"
                  ? `Added ${data.name}`
                  : `Deleted ${data.name}`;

              // ✅ Last Activity
              if (setLastEvent) {
                setLastEvent(value);
                localStorage.setItem("lastEvent", value);
              }

              // ✅ Stats update
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
            } catch (err) {
              console.error("❌ Invalid message format", err);
            }
          }
        );

        client.onDisconnect = () => {
          console.log("🔌 Disconnected");
          subscription.unsubscribe();
        };
      },

      onStompError: (frame) => {
        console.error("❌ Broker error:", frame.headers["message"]);
      },

      onWebSocketError: (error) => {
        console.error("❌ WebSocket error:", error);
      },
    });

    client.activate();

    return () => {
      console.log("🛑 Cleaning up WebSocket");
      client.deactivate();
    };
  }, [setLastEvent, setStats, onNewEvent]);
};

export default useKafkaEvents;