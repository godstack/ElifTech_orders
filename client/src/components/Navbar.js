import React from "react";
import { NavLink } from "react-router-dom";
import "../css/Navbar.css";

export const Navbar = () => {
  return (
    <nav>
      <div className="nav-wrapper">
        <div className="nav-links">
          <NavLink className="link" to="/">
            Orders list
          </NavLink>

          <NavLink className="link" to="/upload">
            Upload file
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
