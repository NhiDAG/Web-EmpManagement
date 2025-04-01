import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
      name: "",
      gender: "Male",
      phone: "",
      password: "",
  });

  const [errors, setErrors] = useState({});
  const [createdEmail, setCreatedEmail] = useState(null);

  const handleChange = (e) => {
      const { id, value } = e.target;
      setFormData((prev) => ({ ...prev, [id]: value }));
      setErrors((prev) => ({ ...prev, [id]: "" })); 
  };

  const validateForm = () => {
      let newErrors = {};
      if (!formData.name.trim()) newErrors.name = "Name required.";
      if (!formData.phone.trim()) newErrors.phone = "Phone required.";
      else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Invalid phone.";
      if (!formData.password.trim()) newErrors.password = "Password required.";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
        const response = await fetch("https://localhost:7028/api/employees", { 
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error("Failed to create employee");
      
      const responseData = await response.json();
      const email = responseData.email;
      
      navigate(`/success?email=${email}`);
    } catch (error) {
        console.error("Error:", error);
        setErrors({ general: "Unexpected error." });
    }
};



if (createdEmail) {
    return (
        <div className="register-container">
            <h2>Registration Successful!</h2>
            <p>Your email: <strong>{createdEmail}</strong></p>
            <p>Redirecting to login...</p>
        </div>
    );
}

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} id="employeeForm">
                <h2>Register</h2>
                {errors.general && <p className="error-message">{errors.general}</p>}

                <div className="add-form">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={formData.name} onChange={handleChange} />
                    {errors.name && <p className="error-message">{errors.name}</p>}

                    <label htmlFor="gender">Gender:</label>
                    <select id="gender" value={formData.gender} onChange={handleChange}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>

                    <label htmlFor="phone">Phone:</label>
                    <input type="text" id="phone" value={formData.phone} onChange={handleChange} />
                    {errors.phone && <p className="error-message">{errors.phone}</p>}

                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" value={formData.password} onChange={handleChange} />
                    {errors.password && <p className="error-message">{errors.password}</p>}
                </div>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default RegisterPage;
