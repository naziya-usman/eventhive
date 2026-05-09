import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for user in localStorage whenever the location changes
    const storedUser = localStorage.getItem('eventhive_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('eventhive_token');
    localStorage.removeItem('eventhive_user');
    setUser(null);
    setIsOpen(false);
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          EventHive
        </Link>

        <button className="navbar-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          <span className={`hamburger ${isOpen ? 'open' : ''}`}></span>
        </button>

        <div className={`navbar-menu ${isOpen ? 'active' : ''}`}>
          <div className="navbar-center">
            <Link to="/" className="navbar-link" onClick={closeMenu}>Home</Link>
            <Link to="/" className="navbar-link" onClick={closeMenu}>Events</Link>
          </div>

          <div className="navbar-right">
            {user ? (
              <>
                <span className="navbar-user">Hi, {user.name}</span>
                {user.role === 'organizer' && (
                  <Link to="/dashboard" className="navbar-link" onClick={closeMenu}>Dashboard</Link>
                )}
                <Link to="/my-tickets" className="navbar-link" onClick={closeMenu}>My Tickets</Link>
                <button className="navbar-btn logout-btn" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-link" onClick={closeMenu}>Login</Link>
                <Link to="/register" className="navbar-btn register-btn" onClick={closeMenu}>Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
