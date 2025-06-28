import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import 'materialize-css/dist/css/materialize.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import Auth from './components/Auth.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Auth isNewUser={false}/>} />
        <Route path="/signup" element={<Auth isNewUser={true}/>} />
        <Route path="/app" element={<App />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
