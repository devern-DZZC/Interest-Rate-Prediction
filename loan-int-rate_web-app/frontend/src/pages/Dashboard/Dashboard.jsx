import React, { useEffect, useState } from 'react';
import SideNav from '../../components/SideNav';
import CardTable from '../../components/CardTable';
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
        console.error('Failed to fetch clients');
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
    // TODO: Implement view details functionality
    console.log('View client details for:', clientId);
  };

  // New: Delete client handler
  const handleDelete = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/delete/${clientId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        alert('Client deleted successfully');
        fetchClients(); // refresh list
      } else {
        alert('Failed to delete client');
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('An error occurred deleting client');
    }
  };

  return (
    <div className="app-layout">
      <SideNav />
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <p className="dashboard-subtitle">Here is your list of clients</p>
        </header>

        {clientList.length === 0 ? (
          <p className="empty-state">No clients found. Please add some clients.</p>
        ) : (
          <CardTable
            customers={clientList}
            onView={handleView}
            onDelete={handleDelete} // pass delete handler
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
