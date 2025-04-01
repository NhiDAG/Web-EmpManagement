import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import "../styles/signup.css"; 

const EmailResponse = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = new URLSearchParams(location.search).get("email");

    return (
        <div className="success-container">
            <FaCheckCircle className="success-icon" />
            <h2>Successfully Sign Up</h2>
            {email ? <p>Your account has been created with email: <strong>{email}</strong></p> : <p>No email found.</p>}<br/>
            <button onClick={() => navigate("/")} className="btn-login">
                Go to Login
            </button>
        </div>
    );
};

export default EmailResponse;
