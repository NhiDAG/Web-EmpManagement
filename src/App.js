import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "../src/pages/LoginPage";
import ProtectedRoute from "../src/services/ProtectedRoute";
import SignupPage from "../src/pages/SignupPage";
import AdminPage from "../src/pages/AdminPage";
import ChatPage from "../src/pages/ChatPage";
import EmpTable from "../src/components/EmpTable";
import EmpChart from "../src/components/EmpChart";
import HomePage from "../src/pages/HomePage";
import EmailResponse from "../src/components/EmailResponse";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/success" element={<EmailResponse/>} />

        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/employeeTable" element={<EmpTable />} />
          <Route path="/employeeChart" element={<EmpChart />} />
        </Route>

        <Route element={<ProtectedRoute adminOnly={false}/>}>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/home" element={<HomePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
