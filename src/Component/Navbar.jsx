import { FaBlog, FaChartBar, FaHome, FaMoon, FaPlusSquare, FaSignOutAlt, FaSun } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();

  const {theme , toggleTheme} = useTheme();

  const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");
  const userName = loginData?.username || "User";

  const handleLogout = () => {
    localStorage.removeItem("loginData");  
    navigate("/login");                   
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Logo */}
        <div className="navbar-logo">
          <FaBlog className="logo-icon" />
          <span className="logo-text">BlogPost</span>
        </div>

        {/* Links */}
        <div className="navbar-links">
          <NavLink to="/dashboard" className="nav-item">
            <FaHome className="nav-icon" /> Home
          </NavLink>

          <NavLink to="/create-post" className="nav-item">
            <FaPlusSquare className="nav-icon" /> Create Post
          </NavLink>

          
          <NavLink to="/Analytics" className="nav-item">
            <FaChartBar className="nav-icon" />
            Analytics
          </NavLink>
        </div>

        {/* Right Side */}
        <div className="navbar-actions">
          <span className="user-name">Hi, {userName}</span>

          <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? <FaMoon/> : <FaSun/>}
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;