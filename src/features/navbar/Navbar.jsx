import { Link, useNavigate } from "react-router-dom";
import userService from "../../app/services/userService.js";
import { useState, useEffect } from "react";
import "./navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(userService.getCurrentUser());
  }, []);

  const handleLogout = () => {
    userService.logout();
    setUser(null);
    navigate("/login");
    setMenuOpen(false);
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">
          Task Manager
        </Link>
      </div>

      <div className={`navbar-right ${menuOpen ? "open" : ""}`}>
        {user ? (
          <>
            <span className="navbar-user">{user.username}</span>
            <button className="navbar-logout" onClick={handleLogout}>
              Odhlásit se
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="navbar-login"
            onClick={() => setMenuOpen(false)}
          >
            Přihlášení
          </Link>
        )}
      </div>

      <button className="navbar-hamburger" onClick={toggleMenu}>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>
    </nav>
  );
}
