import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import {useState} from 'react'

const Login = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password})
    })

    if (response.ok) {
        navigate('/app')
    } else
        alert("Invalid username or password");
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
                  onChange={(e) => setUsername(e.target.value)}
                  required
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
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
