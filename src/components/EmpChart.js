import React, { useEffect, useRef, useState, useCallback } from "react";
import "../styles/chartStyle.css";
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";
import * as signalR from "@microsoft/signalr";

Chart.register(PieController, ArcElement, Tooltip, Legend);

function EmpChart() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const connectionRef = useRef(null);
  const [joinedGroups, setJoinedGroups] = useState({
    Active: true,
    Inactive: true,
  });
  const [selectedGroup, setSelectedGroup] = useState("Active");

  useEffect(() => {

    connectionRef.current = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7028/hubs/employee", {
        withCredentials: true,
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connectionRef.current
      .start()
      .then(() => {
        console.log("SignalR connected");

        connectionRef.current.on("ReceiveMessage", (data) => {
          console.log("📡 Received update from SignalR:", JSON.stringify(data, null, 2));
          if (!data || Object.keys(data).length === 0) {
            console.warn("Received empty data, skipping chart update");
            return;
          }
          updateChart(data);
        });
      })
      .catch((err) => console.error("SignalR Error:", err));

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!chartRef.current) return;
  
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;
  
    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ["Active", "Inactive"],
        datasets: [
          {
            label: "Employees",
            data: [0, 0],
            backgroundColor: ["rgba(75, 192, 192, 0.5)", "rgba(255, 99, 132, 0.5)"],
            borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: "top" },
        },
      },
    });
  
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []);  

  const updateChart = (data) => {
    if (!chartInstance.current) {
      console.warn("Chart instance is not initialized.");
      return;
    }
  
    const activeCount = joinedGroups.Active ? data.activeCount ?? 0 : 0;
    const inactiveCount = joinedGroups.Inactive ? data.inactiveCount ?? 0 : 0;
  
    console.log("Updating chart with:", { activeCount, inactiveCount });
  
    chartInstance.current.data.datasets[0].data = [activeCount, inactiveCount];
    chartInstance.current.update();
  };
  
  useEffect(() => {
    if (!connectionRef.current) return;
  
    connectionRef.current.on("ReceiveMessage", (data) => {
      console.log("📡 Received update from SignalR:", JSON.stringify(data, null, 2));
  
      if (!data || typeof data !== "object") {
        console.warn("Invalid data received:", data);
        return;
      }
  
      if (!("activeCount" in data) || !("inactiveCount" in data)) {
        console.warn("Missing required fields in received data:", data);
        return;
      }
  
      updateChart(data);
    });
  
    return () => {
      connectionRef.current.off("ReceiveMessage");
    };
  }, [joinedGroups]);
  

  const handleJoinGroup = async () => {
    if (!connectionRef.current || connectionRef.current.state !== signalR.HubConnectionState.Connected) {
      console.error("SignalR not connected yet.");
      return;
    }
  
    if (!joinedGroups[selectedGroup]) {
      try {
        await connectionRef.current.invoke("JoinGroup", selectedGroup);
        setJoinedGroups((prev) => ({ ...prev, [selectedGroup]: true }));
      } catch (err) {
        console.error("Error joining group:", err);
      }
    }
  };
  
  const handleLeaveGroup = async () => {
    if (!connectionRef.current || connectionRef.current.state !== signalR.HubConnectionState.Connected) {
      console.error("SignalR not connected yet.");
      return;
    }
  
    if (joinedGroups[selectedGroup]) {
      try {
        await connectionRef.current.invoke("LeaveGroup", selectedGroup);
        setJoinedGroups((prev) => ({ ...prev, [selectedGroup]: false }));
      } catch (err) {
        console.error("Error leaving group:", err);
      }
    }
  };
  

  return (
    <div className="chart-container">
      <h2>Employee Data Chart (Real-Time)</h2>
      <div className="selection">
        <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <button onClick={handleJoinGroup} className="group-button">
          Join Group
        </button>
        <button
          onClick={handleLeaveGroup}
          className="group-button"
          disabled={!joinedGroups.Active && !joinedGroups.Inactive}
        >
          Leave Group
        </button>
      </div>
      <canvas ref={chartRef} style={{width: 400, height: 400}} />
    </div>
  );
}

export default EmpChart;
