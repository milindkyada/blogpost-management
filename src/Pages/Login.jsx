import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};

    if (!loginData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = "Invalid email address.";
    }

    if (!loginData.password.trim()) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const user = JSON.parse(localStorage.getItem("authData"));

    if (
      user &&
      loginData.email === user.email &&
      loginData.password === user.password
    ) {
      localStorage.setItem(
        "loginData",
        JSON.stringify({
          email: user.email,
          isLoggedIn: true,
        }),
      );
      toast.success("login successful!😊");
      navigate("/Dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="register-page">
    <div className="form-container">
      <h1 className="form-title">LOGIN</h1>

      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="form-group">
          <label>Email Address</label>
          <input
            name="email"
            placeholder="Enter your email address"
            value={loginData.email}
            onChange={handleInputChange}
            className={errors.email ? "error-input" : ""}
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={loginData.password}
              onChange={handleInputChange}
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

        <button type="submit" className="btn-primary">
          Login
        </button>
      </form>

      <p className="link-text">
        Don't have an account? <a href="/Register">Register here</a>
      </p>
    </div>
    </div>
  );
};

export default Login;