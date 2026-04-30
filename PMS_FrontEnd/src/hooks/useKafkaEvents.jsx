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

              // =========================
              // ✅ SEND EVENT TO UI
              // =========================
              if (onNewEvent) {
                onNewEvent(data);
              }

              // =========================
              // ✅ ACTIVITY TEXT
              // =========================
              let value = "";

              if (data.eventType === "PATIENT_CREATED") {
                value = `Added ${data.name}`;
              } else if (data.eventType === "PATIENT_DELETED") {
                value = `Deleted ${data.name}`;
              } else if (data.eventType === "PATIENT_UPDATED") {
                value = `Updated ${data.name}`;
              }

              // =========================
              // ✅ LAST EVENT
              // =========================
              if (setLastEvent) {
                setLastEvent(value);
                localStorage.setItem("lastEvent", value);
              }

              // =========================
              // ✅ STATS UPDATE (FIXED)
              // =========================
              if (setStats) {
                setStats((prev) => {
                  let newTotal = prev.total;
                  let newToday = prev.today;
                  let newDischarged = prev.discharged || 0;
                  let newCritical = prev.critical || 0;

                  if (data.eventType === "PATIENT_CREATED") {
                    newTotal += 1;
                    newToday += 1;
                  } 
                  else if (data.eventType === "PATIENT_DELETED") {
                    newTotal -= 1;
                  } 
                  else if (data.eventType === "PATIENT_UPDATED") {
                    // 🔥 depends on backend sending status
                    if (data.status === "DISCHARGED") {
                      newDischarged += 1;
                    }
                    if (data.status === "CRITICAL") {
                      newCritical += 1;
                    }
                  }

                  return {
                    total: newTotal,
                    today: newToday,
                    discharged: newDischarged,
                    critical: newCritical,
                  };
                });
              }

              // =========================
              // ✅ TOASTS (FIXED)
              // =========================
              if (data.eventType === "PATIENT_CREATED") {
                toast.success(
                  <div>
                    <strong>Patient Created ✅</strong>
                    <div>👤 {data.name}</div>
                    <div>📧 {data.email}</div>
                  </div>,
                  { toastId: data.patientId + "-created" }
                );

              } else if (data.eventType === "PATIENT_UPDATED") {
                toast.info(
                  <div>
                    <strong>Status Updated 🔄</strong>
                    <div>👤 {data.name}</div>
                    <div>📌 {data.status}</div>
                  </div>,
                  { toastId: data.patientId + "-updated" }
                );

              } else if (data.eventType === "PATIENT_DELETED") {
                toast.error(
                  <div>
                    <strong>Patient Deleted ❌</strong>
                    <div>👤 {data.name}</div>
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