import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import "../styles/login.css";
import logo from "../assets/icons/logo-svgrepo-com.svg";
import loginImage from "../assets/images/login-elements.png";

function LoginPage() {
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  const login = async (event) => {
    event.preventDefault(); 
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    setError(null);

    try {
      const response = await fetch("https://localhost:7028/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const responseData = await response.json();
        const token = responseData.token; 

        if (token) {
          document.cookie = `token=${token}; Secure; SameSite=None`;

          const decodedToken = jwtDecode(token);
          if (decodedToken.role === "Admin") {
            navigate("/admin");
          } else {
            navigate("/chat");
          }
        }
      } else {
        setError("Wrong email/password. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-form-column">
          <div className="login-form-wrapper" id="login-form">
            <div className="logo">
              <img src={logo} alt="Logo" />
            </div>
            <div className="welcome-message">Welcome back!!!</div>
            <h1 className="login-title">Log In</h1>
            {error && <p style={{ color: "red", textAlign: "flex-start" }}>{error}</p>}
            <form onSubmit={login}>
              <label htmlFor="email" className="email-label">
                Email
              </label>
              <input type="email" id="email" className="email-input" placeholder="login@company.com" autoComplete="email" required />
              <div className="password-row">
                <label htmlFor="password" className="password-label">
                  Password
                </label>
              </div>
              <input type="password" id="password" placeholder="**********" autoComplete="current-password" required />
              <div className="login-button-field">
                <button type="submit" className="login-button">
                  <span>LOGIN</span>
                </button>
              </div>
              <Link to="/signup" style={{ textAlign: "center" }}>Create new account</Link>
            </form>
          </div>
        </div>
        <div className="image-column">
          <img loading="lazy" src={loginImage} className="login-image" alt="Login illustration" />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
