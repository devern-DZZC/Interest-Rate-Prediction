import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = ({ isNewUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const API_BASE_URL =
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === 'production'
      ? 'https://loan-advisor.azurewebsites.net'
      : 'http://localhost:5004';

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_BASE_URL}${isNewUser ? '/signup' : '/login'}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ username, password }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        localStorage.setItem('token', result.token);
        navigate('/dashboard');
      } else {
        alert(result.message || 'Invalid username or password');
      }
    } catch (err) {
      console.error('Auth request failed:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div
          className={`auth-image ${isNewUser ? 'signup-img' : 'login-img'}`}
          aria-hidden="true"
        />
        <div className="auth-content">
          <h1 className="auth-title">Welcome to LoanAdvisor</h1>
          <p className="auth-subtitle">
            {isNewUser
              ? 'Create an account to get started'
              : 'Log in to your account'}
          </p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <label htmlFor="username" className="auth-label">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className="auth-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />

            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="auth-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isNewUser ? 'new-password' : 'current-password'}
            />

            <button type="submit" className="btn-auth">
              {isNewUser ? 'Sign Up' : 'Log In'}
            </button>
          </form>

          <p className="auth-switch">
            {isNewUser ? 'Already have an account?' : "Don't have one yet?"}{' '}
            <Link
              to={isNewUser ? '/' : '/signup'}
              className="auth-switch-link"
              tabIndex={0}
            >
              {isNewUser ? 'Log in' : 'Sign up'}
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Auth;
