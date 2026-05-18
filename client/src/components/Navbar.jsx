import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUser, clearAuth } from "../utils/auth";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for user in localStorage whenever the location changes
    setUser(getUser());
  }, [location]);

  const handleLogout = () => {
    clearAuth();
    setUser(null);
    setIsOpen(false);
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div
        className={`navbar-overlay ${isOpen ? "active" : ""}`}
        onClick={closeMenu}
      ></div>

      {/* Top Navbar - Always visible on Desktop, Logo only on Mobile */}
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/logo.png" alt="EventHive Logo" className="logo-img" />
          <span>EventHive</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-desktop-menu">
          <div className="navbar-center">
            <Link to="/" className="navbar-link">
              Home
            </Link>
            <Link to="/events" className={`navbar-link ${location.pathname === '/events' ? 'active' : ''}`}>
              Events
            </Link>
          </div>

          <div className="navbar-right">
            {user ? (
              <>
                <span className="navbar-user">Hi, {user.name}</span>
                {user.role === "organiser" && (
                  <Link to="/dashboard" className="navbar-link">
                    Dashboard
                  </Link>
                )}
                <Link to="/my-tickets" className="navbar-link">
                  My Tickets
                </Link>
                <button
                  className="navbar-btn logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-link">
                  Login
                </Link>
                <Link to="/register" className="navbar-btn register-btn">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating Bottom Dock - Mobile Only */}
      <div className="mobile-bottom-dock">
        <Link
          to="/"
          className={`dock-item ${location.pathname === "/" ? "active" : ""}`}
          onClick={closeMenu}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>Home</span>
        </Link>
        <Link
          to="/events"
          className={`dock-item ${location.pathname === "/events" ? "active" : ""}`}
          onClick={closeMenu}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>Events</span>
        </Link>
        {user && user.role === "organiser" ? (
          <Link
            to="/dashboard"
            className={`dock-item ${location.pathname === "/dashboard" ? "active" : ""}`}
            onClick={closeMenu}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <span>Admin</span>
          </Link>
        ) : (
          <Link
            to="/my-tickets"
            className={`dock-item ${location.pathname === "/my-tickets" ? "active" : ""}`}
            onClick={closeMenu}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <span>Tickets</span>
          </Link>
        )}
        <button
          className={`dock-item ${isOpen ? "active" : ""}`}
          onClick={toggleMenu}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>{user ? "Profile" : "Login"}</span>
        </button>
      </div>

      {/* Bottom Sheet Menu - Mobile Only */}
      <div className={`bottom-sheet ${isOpen ? "active" : ""}`}>
        <div className="sheet-handle" onClick={closeMenu}></div>
        <div className="sheet-content">
          {user ? (
            <div className="sheet-user-info">
              <div className="user-avatar">{user.name.charAt(0)}</div>
              <div className="user-details">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <span className="user-role-badge">{user.role}</span>
              </div>
            </div>
          ) : (
            <div className="sheet-header">
              <h3>Welcome to EventHive</h3>
              <p>Sign in to manage your events and tickets</p>
            </div>
          )}

          <div className="sheet-links">
            {user ? (
              <>
                <Link
                  to="/my-tickets"
                  className="sheet-link"
                  onClick={closeMenu}
                >
                  My Tickets
                </Link>
                {user.role === "organiser" && (
                  <Link
                    to="/dashboard"
                    className="sheet-link"
                    onClick={closeMenu}
                  >
                    Organiser Dashboard
                  </Link>
                )}
                <button
                  className="sheet-link logout-link"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="sheet-btn login-btn"
                  onClick={closeMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="sheet-btn register-btn"
                  onClick={closeMenu}
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
