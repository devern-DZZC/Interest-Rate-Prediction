import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './SideNav.css';

const SideNav = () => {
  const navigate = useNavigate();

  const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://loan-advisor.azurewebsites.net' 
  : 'http://localhost:5004'; // or your backend port

  const logout = async (e) => {

    e.preventDefault();
    const response = await fetch(`${API_BASE_URL}/logout`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })

    if(response.ok){
      navigate('/')
    }
    else{
      console.log('Logout Failed!')
    }
  }

  return (
    <nav className="side-nav">
      <h2 className="side-nav-title">LoanAdvisor</h2>
      <ul className="nav-links">
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
        <li>
          <NavLink 
            to="/analyze" 
            className={({ isActive }) => isActive ? "active-link" : ""}
          >
            Analysis
          </NavLink>
        </li>
      </ul>

      <div className="logout-container">
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default SideNav;
