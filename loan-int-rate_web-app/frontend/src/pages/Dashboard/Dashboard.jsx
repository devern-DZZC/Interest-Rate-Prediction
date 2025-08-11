import React, { useEffect, useState } from 'react';
import SideNav from '../../components/SideNav';
import CardTable from '../../components/CardTable';
import InsightsPanel from '../../components/InsightsPanel';
import './Dashboard.css';

const Dashboard = () => {
  const [clientList, setClientList] = useState([]);

  const API_BASE_URL =
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === 'production'
      ? 'https://loan-advisor.azurewebsites.net'
      : 'http://localhost:5004';

  const fetchClients = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const result = await response.json();
      if (response.ok) {
        setClientList(result || []);
      } else {
        setClientList([]);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      setClientList([]);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleView = (clientId) => {
    console.log('View client details for:', clientId);
  };

  return (
    <div className="app-layout">
      <SideNav />
      
      <main className="main-content dashboard-grid">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
        </header>

        <div className="table-section">
          {clientList.length === 0 ? (
            <p className="empty-state">No clients found. Please add some clients.</p>
          ) : (
            <CardTable customers={clientList} onView={handleView} onDelete={fetchClients}/>
          )}
        </div>

        <div className="insights-section">
          <InsightsPanel customers={clientList} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
