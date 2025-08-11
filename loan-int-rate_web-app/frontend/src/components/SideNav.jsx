import React from 'react';
import { NavLink } from 'react-router-dom';
import './SideNav.css';

const SideNav = () => {
  return (
    <nav className="side-nav">
      <h2 className="side-nav-title">LoanAdvisor</h2>
      <ul>
        <li>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/predict" 
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Predict
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/upload" 
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Upload
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default SideNav;
