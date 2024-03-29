import React from 'react';
// Import NavLink for navigation links, replace this if you're using react-router-dom's Link or NavLink components
import { NavLink } from 'react-router-dom';

function Navbar({ mentorName }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">Mentor's Dashboard</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              {/* <NavLink className="nav-link" to="/add-student">Add Student</NavLink> */}
            </li>
            {/* You can add more nav items here */}
          </ul>
          <span className="navbar-text ms-auto">
            {mentorName}
          </span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
