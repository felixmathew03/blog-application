import { Link, useNavigate, useLocation } from "react-router-dom";
import { showToast } from "./Toast";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const token = localStorage.getItem("access_token");
  const userString = localStorage.getItem("user");
  let user = null;
  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (e) {
      console.error(e);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    showToast("Logged out successfully", "success");
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <span className="logo-gradient">MERN</span>Blog
      </Link>

      <div className="nav-links">
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>Home</Link>
        
        {token ? (
          <>
            <Link to="/create-blog" className={location.pathname === "/create-blog" ? "active" : ""}>Create Blog</Link>
            <Link to="/dashboard" className={location.pathname === "/dashboard" ? "active" : ""}>Dashboard</Link>
            
            <div className="user-profile">
              <div className="avatar">{getInitials(user?.name)}</div>
              <span className="user-name">{user?.name}</span>
            </div>
            
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className={location.pathname === "/login" ? "active" : ""}>Login</Link>
            <Link to="/register" className={location.pathname === "/register" ? "active" : ""}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;