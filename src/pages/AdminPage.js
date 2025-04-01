import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/sidebarStyle.css";
import logo from "../assets/icons/logo-svgrepo-com.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faCalendarAlt,
  faBell,
  faChartBar,
  faCog,
  faUserCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import EmpTable from "../components/EmpTable";
import EmpChart from "../components/EmpChart";

function AdminPage() {
  const [activePage, setActivePage] = useState("employeeTable");
  const navigate = useNavigate();

  const toggleSidebar = () => {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("collapsed");
  
    const mainContent = document.getElementById("mainContent");
    if (sidebar.classList.contains("collapsed")) {
      mainContent.style.marginLeft = "60px";
    } else {
      mainContent.style.marginLeft = "250px";
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("https://localhost:7028/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Logout successful");
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <header className="sidebar-header">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <button className="sidebar-toggler" onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faChevronLeft} className="chevron-left" />
          </button>
        </header>

        <nav className="sidebar-nav">
          <ul className="nav-list primary-nav">
            <li className="nav-item">
              <Link
                onClick={() => setActivePage("employeeTable")}
                className="nav-link"
              >
                <FontAwesomeIcon icon={faUserCircle} className="nav-icon" />{" "}
                <span className="nav-label">Employee</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#" className="nav-link">
                <FontAwesomeIcon icon={faCalendarAlt} className="nav-icon" />
                <span className="nav-label">Calendar</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#" className="nav-link">
                <FontAwesomeIcon icon={faBell} className="nav-icon" />
                <span className="nav-label">Notifications</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="#" onClick={(e) => {
                  e.preventDefault();
                  setActivePage("employeeChart");
                }}
                className="nav-link"
              >
                <FontAwesomeIcon icon={faChartBar} className="nav-icon" />{" "}
                <span className="nav-label">Analytics</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="#" className="nav-link">
                <FontAwesomeIcon icon={faCog} className="nav-icon" />
                <span className="nav-label">Settings</span>
              </Link>
            </li>
          </ul>

          <ul className="nav-list secondary-nav">
            <li className="nav-item">
              <Link to="#" className="nav-link">
                <FontAwesomeIcon icon={faUserCircle} className="nav-icon" />
                <span className="nav-label">Profile</span>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link logout-btn" onClick={logout}>
                <FontAwesomeIcon icon={faSignOutAlt} className="nav-icon" />
                <span className="nav-label">Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main-content" id="mainContent">
        {activePage === "employeeTable" && <EmpTable />}
        {activePage === "employeeChart" && <EmpChart />}
      </main>
    </div>
  );
}

export default AdminPage;
