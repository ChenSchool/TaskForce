import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


export default function Navbar() {
  const { user, logout, hasRole, darkMode, toggleDarkMode } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully. See you next time!');
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/dashboard">
          <strong>TaskForce</strong>
        </NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/dashboard">Dashboard</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/aircraft">Aircraft</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/tasks">Tasks</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/personnel">Personnel</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/assignments">Assignments</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/training">Training</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/archives">Archives</NavLink></li>
            {hasRole(['Manager', 'Supervisor']) && (
              <li className="nav-item"><NavLink className="nav-link" to="/users">Users</NavLink></li>
            )}
          </ul>
          <ul className="navbar-nav">
            <li className="nav-item">
              <button 
                className="btn btn-outline-light btn-sm" 
                onClick={toggleDarkMode}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <i className={`bi bi-${darkMode ? 'sun' : 'moon'}-fill`}></i>
              </button>
            </li>
            <li className="navbar-text ms-2">
              <i className="bi bi-person-circle me-2"></i>
              {user.username}
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}