import {
  FaBlog,
  FaChartBar,
  FaFantasyFlightGames,
  FaHome,
  FaParagraph,
  FaPlusSquare,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

const Navbar = ({ onLogout }) => {
  // Get user email from localStorage to display
  const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");
  const userName = loginData?.username || "User";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <FaBlog className="logo-icon" />
          <span className="logo-text">BlogPost</span>
        </div>

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

        <div className="navbar-actions">
          <span className="user-name">Hi, {userName}</span>

          <button className="logout-btn" onClick={onLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
