import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUser, clearAuth } from "../utils/auth";
import "../styles/Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [side, setSide] = useState("bottom"); // top, bottom, left, right
  const [vAlign, setVAlign] = useState("bottom"); // top or bottom half
  const [hAlign, setHAlign] = useState("right"); // left or right half
  const [fabStyle, setFabStyle] = useState({ bottom: "2rem", right: "2rem" });
  const [isDragging, setIsDragging] = useState(false);
  const [dragPos, setDragPos] = useState(null);
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
    setIsMenuOpen(false);
    setIsSheetOpen(false);
    navigate("/login");
  };

  const toggleMenu = (e) => {
    if (isDragging) return;
    setIsMenuOpen(!isMenuOpen);
  };

  const openSheet = () => {
    setIsSheetOpen(true);
    setIsMenuOpen(false);
  };

  const closeAll = () => {
    setIsMenuOpen(false);
    setIsSheetOpen(false);
  };

  // Drag handlers for the FAB
  const handlePointerDown = (e) => {
    if (isMenuOpen) return;
    setIsDragging(false);
    setDragPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerMove = (e) => {
    if (!dragPos) return;
    const dist = Math.hypot(e.clientX - dragPos.x, e.clientY - dragPos.y);
    if (dist > 10) {
      setIsDragging(true);
      setFabStyle({
        top: `${e.clientY - 30}px`,
        left: `${e.clientX - 30}px`,
        bottom: "auto",
        right: "auto",
      });
    }
  };

  const handlePointerUp = (e) => {
    if (isDragging) {
      const x = e.clientX;
      const y = e.clientY;
      const w = window.innerWidth;
      const h = window.innerHeight;

      const dL = x;
      const dR = w - x;
      const dT = y;
      const dB = h - y;

      const min = Math.min(dL, dR, dT, dB);
      const padding = 20;

      const currentVAlign = y < h / 2 ? "top" : "bottom";
      const currentHAlign = x < w / 2 ? "left" : "right";
      setVAlign(currentVAlign);
      setHAlign(currentHAlign);

      if (min === dL) {
        setSide("left");
        setFabStyle({
          left: `${padding}px`,
          top: `${Math.max(padding, Math.min(h - 80, y - 30))}px`,
          bottom: "auto",
          right: "auto",
        });
      } else if (min === dR) {
        setSide("right");
        setFabStyle({
          right: `${padding}px`,
          top: `${Math.max(padding, Math.min(h - 80, y - 30))}px`,
          bottom: "auto",
          left: "auto",
        });
      } else if (min === dT) {
        setSide("top");
        setFabStyle({
          top: `${padding}px`,
          left: `${Math.max(padding, Math.min(w - 80, x - 30))}px`,
          bottom: "auto",
          right: "auto",
        });
      } else {
        setSide("bottom");
        setFabStyle({
          bottom: `${padding}px`,
          left: `${Math.max(padding, Math.min(w - 80, x - 30))}px`,
          top: "auto",
          right: "auto",
        });
      }
    }
    setDragPos(null);
    setTimeout(() => setIsDragging(false), 50);
  };

  return (
    <nav className="navbar">
      <div
        className={`navbar-overlay ${isSheetOpen || isMenuOpen ? "active" : ""}`}
        onClick={closeAll}
      ></div>

      {/* Top Navbar */}
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeAll}>
          <img src="/logo.png" alt="EventHive Logo" className="logo-img" />
          <span>EventHive</span>
        </Link>

        {/* Mobile Hamburger - Visible only on Mobile */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <div className={`hamburger-bar ${isMenuOpen ? "active" : ""}`}></div>
        </button>

        {/* Desktop Menu */}
        <div className="navbar-desktop-menu">
          <div className="navbar-center">
            <Link to="/" className="navbar-link">
              Home
            </Link>
            <Link
              to="/events"
              className={`navbar-link ${location.pathname === "/events" ? "active" : ""}`}
            >
              Events
            </Link>
          </div>

          <div className="navbar-right">
            {user ? (
              <>
                <div className="navbar-user-chip">
                  <div className="navbar-user-avatar">
                    {user.name.charAt(0)}
                  </div>
                  <span className="navbar-user-name">
                    hi, {user.name.split(" ")[0]}
                  </span>
                </div>
                {user.role === "organiser" && (
                  <Link
                    to="/dashboard"
                    className={`navbar-link ${location.pathname === "/dashboard" ? "active" : ""}`}
                  >
                    Dashboard
                  </Link>
                )}
                <Link
                  to="/my-tickets"
                  className={`navbar-link ${location.pathname === "/my-tickets" ? "active" : ""}`}
                >
                  Tickets
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

      {/* Centered FAB Menu Items - Mobile Only */}
      <div className={`fab-menu-centered ${isMenuOpen ? "active" : ""}`}>
        <Link to="/" className="fab-item-center" onClick={closeAll}>
          <div className="fab-icon-center">🏠</div>
          <span className="fab-label-center">Home</span>
        </Link>
        <Link to="/events" className="fab-item-center" onClick={closeAll}>
          <div className="fab-icon-center">✨</div>
          <span className="fab-label-center">Discover</span>
        </Link>
        <Link to="/my-tickets" className="fab-item-center" onClick={closeAll}>
          <div className="fab-icon-center">🎟️</div>
          <span className="fab-label-center">Tickets</span>
        </Link>
        <button className="fab-item-center" onClick={openSheet}>
          <div className="fab-icon-center">
            {user ? user.name.charAt(0) : "👤"}
          </div>
          <span className="fab-label-center">Profile</span>
        </button>
      </div>

      {/* Floating Action Button - Mobile Only */}
      <div
        className={`mobile-fab-container side-${side} ${isMenuOpen ? "active" : ""} ${isDragging ? "dragging" : ""}`}
        style={fabStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <button
          className={`fab-main-btn ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <div className="fab-burger"></div>
        </button>
      </div>

      {/* Bottom Sheet Menu - Full Navigation Mobile */}
      <div className={`bottom-sheet ${isSheetOpen ? "active" : ""}`}>
        <div className="sheet-handle" onClick={closeAll}></div>
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
              <h3>EventHive</h3>
              <p>Sign in to unlock full access</p>
            </div>
          )}

          <div className="sheet-links">
            {user ? (
              <>
                {user.role === "organiser" && (
                  <Link
                    to="/dashboard"
                    className="sheet-link"
                    onClick={closeAll}
                  >
                    <span className="icon">📊</span> Organiser Dashboard
                  </Link>
                )}
                <div className="sheet-divider"></div>
                <button
                  className="sheet-link logout-link"
                  onClick={handleLogout}
                >
                  <span className="icon">🚪</span> Logout
                </button>
              </>
            ) : (
              <div className="sheet-auth-grid">
                <Link
                  to="/login"
                  className="sheet-btn login-btn"
                  onClick={closeAll}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="sheet-btn register-btn"
                  onClick={closeAll}
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
