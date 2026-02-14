import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (formData.name.length < 3) {
      newErrors.name = "Minimum 3 characters required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters required.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

const handleSubmit = (e) => {
  e.preventDefault();
  if (!validate()) return;

  // 🔹 Get existing users
  const existingUsers =
    JSON.parse(localStorage.getItem("authData")) || [];

  // 🔹 New user object
  const newUser = {
    username: formData.name,
    email: formData.email,
    phone: formData.phone,
    password: formData.password,
  };

  // 🔹 Add new user to array
  existingUsers.push(newUser);

  // 🔹 Save back to localStorage
  localStorage.setItem("authData", JSON.stringify(existingUsers));

  toast.success("Registration successful! 👍");
  navigate("/login");
};



  return (
    <div className="register-page">
    <div className="form-container">
      <h1 className="form-title">CREATE ACCOUNT</h1>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="form-group">
          <label>Full Name</label>
          <input
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? "error-input" : ""}
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email Address</label>
          <input
            name="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error-input" : ""}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        {/* Phone */}
        <div className="form-group">
          <label>Phone Number</label>
          <input
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? "error-input" : ""}
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? "error-input" : ""}
            />
            <span
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        {/* Confirm Password */}
        <div className="form-group">
          <label>Confirm Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? "error-input" : ""}
            />
            <span
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
              }}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "🙈" : "👁️"}
            </span>
          </div>
          {errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}
        </div>

        <button type="submit" className="btn-primary">
          Register
        </button>
      </form>

      <p className="link-text">
        Already have an account? <a href="/Login">Login here</a>
      </p>
    </div>
    </div>
  );
};

export default Register;