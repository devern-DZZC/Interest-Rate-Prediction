import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 'materialize-css/dist/css/materialize.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from './components/Auth.jsx';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Predict from './pages/Predict/Predict.jsx';
import Upload from './pages/Upload/Upload.jsx';
import Analyze from './pages/Analyze/Analyze.jsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/" element={<Auth isNewUser={false} />} />
        <Route path="/signup" element={<Auth isNewUser={true} />} />

        {/* Redirect /app to /dashboard (cleaner naming) */}
        <Route path="/app" element={<Navigate to="/dashboard" replace />} />

        {/* Main App Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/analyze" element={<Analyze />} />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
