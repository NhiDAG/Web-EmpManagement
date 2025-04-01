import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import * as signalR from "@microsoft/signalr";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const CustomPieChart = () => {
  const [data, setData] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("Active");
  const [joinedGroups, setJoinedGroups] = useState({ Active: false, Inactive: false });

  useEffect(() => {
    const fetchData = async () => {
      setData([
        { name: "Group A", value: 400 },
        { name: "Group B", value: 300 },
        { name: "Group C", value: 300 },
        { name: "Group D", value: 200 }
      ]);
    };
    fetchData();
  }, []);

  const handleJoinGroup = () => {
    setJoinedGroups((prev) => ({ ...prev, [selectedGroup]: true }));
  };

  const handleLeaveGroup = () => {
    setJoinedGroups({ Active: false, Inactive: false });
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
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default CustomPieChart;
