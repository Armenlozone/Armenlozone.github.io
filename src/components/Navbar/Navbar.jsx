import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">

      {/* Site title */}
      <div className="navbar-title">
        <Link to="/" onClick={closeMenu}>
          Armen's HQ
        </Link>

        <p className="navbar-subtitle">
          Military History, Research and 3D Modelling
        </p>
      </div>

      {/* Mobile menu button */}
      <button
        className="mobile-menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation menu"
        aria-expanded={menuOpen}
      >
        ☰
      </button>

      {/* Navigation */}
      <nav className={`navbar-links ${menuOpen ? "mobile-open" : ""}`}>

        <NavLink to="/" onClick={closeMenu}>
          Home
        </NavLink>

        <NavLink to="/articles" onClick={closeMenu}>
          Articles
        </NavLink>

        <NavLink to="/techtrees" onClick={closeMenu}>
          Tech Trees
        </NavLink>

        <NavLink to="/projects" onClick={closeMenu}>
          Projects & 3D
        </NavLink>

        <NavLink to="/editors/article" onClick={closeMenu}>
          Article Editor
        </NavLink>

        <NavLink to="/editors/techtree" onClick={closeMenu}>
          Tech Tree Editor
        </NavLink>

        <NavLink to="/about" onClick={closeMenu}>
          About
        </NavLink>

      </nav>

    </header>
  );
}