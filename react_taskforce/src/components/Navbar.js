import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">TaskForce</NavLink>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item"><NavLink className="nav-link" to="/aircraft">Aircraft</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/tasks">Tasks</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/personnel">Personnel</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/assignments">Assignments</NavLink></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}