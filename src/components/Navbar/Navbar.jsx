import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (

<header className="navbar">
      <div className="navbar-title">
        <Link to="/">
            Armen's HQ
        </Link>
        <p className="navbar-subtitle">
          Military History, Research and 3D Modelling 
        </p>
      </div>
      <nav className="navbar-links">
        <NavLink to="/">
          Home
        </NavLink>
        <NavLink to="/articles">
          Articles
        </NavLink>
        <NavLink to="/techtrees">
          Tech Trees
        </NavLink>
        <NavLink to="/projects">
          Projects & 3D
        </NavLink>
        <NavLink to="/editors/article">
          Article Editor
        </NavLink>
        <NavLink to="/editors/techtree">
          Tech Tree Editor
        </NavLink>
        <NavLink to="/about">
          About
        </NavLink>
      </nav>
    </header>
  );
}