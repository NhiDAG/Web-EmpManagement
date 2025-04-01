import React, { useEffect, useState } from "react";
import "../styles/table.css";
import trashIcon from "../assets/icons/trash-bin-trash-svgrepo-com.svg";
import updateIcon from "../assets/icons/edit-svgrepo-com.svg";
import * as signalR from "@microsoft/signalr";
import EmpUpdateForm from "./EmpUpdateForm.js";

function EmpTable() {
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  useEffect(() => {
    fetchEmployees(currentPage);

    const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7028/hubs/employee", { 
      withCredentials: true,
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

    connection
      .start()
      .then(() => console.log("SignalR connection established."))
      .catch((err) =>
        console.error("Error establishing SignalR connection:", err)
      );

    connection.on("ReceiveNotification", async (message) => {
      console.log("Notification received:", message);
      showNotification(message);
      await fetchEmployees(currentPage);
    });

    return () => {
      connection.stop();
    };
  }, [currentPage]);

  async function fetchEmployees(page) {
    try {
      const response = await fetch(
        `https://localhost:7028/api/employees?page=${page}&pageSize=${pageSize}`,
        {
          method: "GET",
          credentials: "include", 
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        console.error("Unauthorized! Token may be invalid or expired.");
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) throw new Error("Invalid API response format!");

      setEmployees(data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }

  function deleteEmployee(employeeId) {
    if (!window.confirm(`Are you sure you want to delete Employee ID: ${employeeId}?`)) return;

    fetch(`https://localhost:7028/api/employees/${employeeId}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (!response.ok)
          throw new Error(`Failed to delete Employee ID ${employeeId}`);
        return response.text();
      })
      .then(() => {
        console.log(`Employee ID ${employeeId} deleted successfully`);
        fetchEmployees(currentPage);
      })
      .catch((error) => console.error(error));
  }

  function updateEmployee(employee) {
    setSelectedEmployee(employee);
    setIsUpdateModalOpen(true);
  }

  function closeUpdateModal() {
    setIsUpdateModalOpen(false);
    setSelectedEmployee(null);
  }

  function showNotification(message) {
    const notificationDiv = document.getElementById("notification");
    if (!message.trim()) return;
    notificationDiv.textContent = message;
    notificationDiv.classList.add("show");
    notificationDiv.classList.remove("hide");

    setTimeout(() => {
      notificationDiv.classList.add("hide");
      notificationDiv.classList.remove("show");
    }, 3000);
  }

  return (
    <div className="employee-table-content">
      <h2>Employee Management</h2>
      <div id="notification" className="employee-notification"></div>
      <table id="employeeDataTable">
        <thead>
          <tr>
            <td>ID</td>
            <td>Name</td>
            <td>Gender</td>
            <td>Phone</td>
            <td>Email</td>
            <td>Position</td>
            <td>Salary</td>
            <td>IsActive</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.id || "N/A"}</td>
              <td>{employee.name || "N/A"}</td>
              <td>{employee.gender || "N/A"}</td>
              <td>{employee.phone || "N/A"}</td>
              <td>{employee.email || "N/A"}</td>
              <td>{employee.role || "N/A"}</td>
              <td>{employee.salary || "N/A"}</td>
              <td>{employee.isActive ? "Active" : "Inactive"}</td>
              <td>
                <button
                  className="update-employee-btn"
                  onClick={() => updateEmployee(employee)}
                >
                  <img src={updateIcon} alt="Update" />
                </button>
                <button
                  className="remove-employee-btn"
                  onClick={() => deleteEmployee(employee.id)}
                >
                  <img src={trashIcon} alt="Delete" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <div className="employee-pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span> Page {currentPage} </span>
        <button onClick={() => setCurrentPage((prev) => prev + 1)}>Next</button>
      </div>
      <br />
      {isUpdateModalOpen && (
        <>
          <div className="modal-overlay" onClick={closeUpdateModal}></div>
          <EmpUpdateForm employee={selectedEmployee} onClose={closeUpdateModal} />
        </>
      )}
    </div>
  );
}

export default EmpTable;
