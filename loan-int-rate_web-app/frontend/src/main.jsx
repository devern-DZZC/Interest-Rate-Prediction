import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'materialize-css/dist/css/materialize.min.css';
import App from './App.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/app" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
