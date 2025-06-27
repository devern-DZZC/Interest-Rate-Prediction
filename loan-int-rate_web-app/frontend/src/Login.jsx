import React from 'react';
import { Link } from 'react-router-dom';
import {useState} from 'react'

const Login = () => {
    const {username, setUsername} = useState("")


  const handleSubmit = (e) => {
    e.preventDefault();
    // handle login logic here
    console.log("Form submitted");
  };

  return (
    <div>
      <div className="card">
        <div className="card__img" id="img01"></div>
        <div className="card__content">
          <h2 className="card__content-header">Welcome to LoanAdvisor</h2>
          <p className="card__content-theme">Log in to your account</p>

          <form id="loginForm" onSubmit={handleSubmit} style={{ padding: '1em' }}>
            <div className="row">
              <div className="input-field col s12">
                <input
                  placeholder="Username"
                  name="username"
                  type="text"
                  className="validate"
                />
              </div>
            </div>

            <div className="row">
              <div className="input-field col s12">
                <input
                  placeholder="Password"
                  name="password"
                  type="password"
                  className="validate"
                />
              </div>
            </div>

            <div className="card-action">
              <input type="submit" value="Let's Go" className="btn" id='btn'/>
            </div>
          </form>

          <div className="alt-text">
            <span>Don't have an account yet?</span>{' '}
            <Link to="/signup" style={{ color: '#256215' }}>
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
