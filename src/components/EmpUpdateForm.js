import { useState } from "react";
import "../styles/editForm.css";

const EmpUpdateForm = ({ employee, onClose }) => {
    const [formData, setFormData] = useState({ ...employee });
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch(`https://localhost:7028/api/employees/${employee.id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) throw new Error("Failed to update employee");
  
        console.log("Employee updated successfully");
        onClose();
      } catch (error) {
        console.error("Error updating employee:", error);
      }
    };
  
    return (
      <div className="modal">
        <div className="modal-content">
          <h2>Update Employee</h2>
          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
  
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
  
            <label>Phone</label>
            <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />
  
            <label>Position</label>
            <input type="text" name="role" value={formData.role} onChange={handleChange} required />
  
            <label>Salary</label>
            <input type="number" name="salary" value={formData.salary} onChange={handleChange} required />
  
            <button type="submit">Update</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  };
  
  export default EmpUpdateForm;
  
