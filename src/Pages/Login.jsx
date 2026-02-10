import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  // 🔒 Guard: already logged in → dashboard
  useEffect(() => {
    const loginData = localStorage.getItem("loginData");
    if (loginData) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      setLoginError("Invalid email or password");
      return;
    }

    localStorage.setItem(
      "loginData",
      JSON.stringify({
        isLoggedIn: true,
        userId: user.id,
      })
    );

    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        name: user.name,
        email: user.email,
        phone: user.phone,
      })
    );

    navigate("/dashboard");
  };

  return (
    <div className="login-container">
      <h1 className="login-title">LOGIN</h1>
      <h5>Welcome back! Please login to your account</h5>

      <form onSubmit={handleSubmit}>
       

        {/* Email */}
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({ ...errors, email: "" });
              setLoginError("");
            }}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <small className="error-text">{errors.email}</small>}
        </div>

        {/* Password */}
        <div className="form-group password-group">
          <label>Password</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrors({ ...errors, password: "" });
                setLoginError("");
              }}
              className={errors.password ? "error" : ""}
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>
          {errors.password && (
            <small className="error-text">{errors.password}</small>
          )}
        </div>
         {loginError && <p className="error-text">{loginError}</p>}
        <button type="submit" className="btn-primary">
          Login
        </button>
      </form>

      <p className="link-text">
        Don’t have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default Login;