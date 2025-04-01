import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import '../styles/error.css';
import '../styles/loading.css';

const ProtectedRoute = ({ adminOnly }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const response = await fetch("https://localhost:7028/api/auth/check-token", {
          method: "GET",
          credentials: "include"
        });

        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUserRole(data.role); 
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkToken();
  }, []);
  
  const LoadingSpinner = () => {
    return (
      <div className="loading-overlay">
        <div className="loading-container">
          <div className="spinner"></div>
          <div className="loading-text">Loading</div>
        </div>
      </div>
    );
  };

  if (isAuthenticated === null) return <LoadingSpinner />; 

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const isAdmin = userRole === "Admin";

  if ((adminOnly && !isAdmin) || (!adminOnly && isAdmin)) {
    return <div className="errorContainer">
    <img
      loading="lazy"
      src="https://cdn.builder.io/api/v1/image/assets/TEMP/cc4254f544314c11d62ba7515aeb8d4c3b083453fb089b0a7ccaf336a89cec04?placeholderIfAbsent=true&apiKey=1d890b3ac32c4e0faad33073d6425f1b"
      className= "errorImage"
      alt="403 Error Illustration"
    />
  </div>;
  }

  return <Outlet />;
};

export default ProtectedRoute;
