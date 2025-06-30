import React from 'react';
import Card from './components/Card';
import Form from './components/Form';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const App = () => {

  const [clientList, setClientList] = useState([]);
  const navigate = useNavigate();


  const fetchClients = async () => {
    const response = await fetch ("http://localhost:5000/clients", {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      credentials: 'include'
    })

    const result = await response.json();
    if (response.ok){
      console.log("Clients fetched successfuly")
      console.log(result)
    }else{
      console.log("Failed to fetch clients")
      setClientList([])
    }
    setClientList(result || [])

  }

  useEffect(() => {
    fetchClients();
  }, [])

  const logout = async (e) => {

    e.preventDefault();
    const response = await fetch("http://localhost:5000/logout", {
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


  const purpose_map = {
    credit_card: "Credit Card",
    debt_consolidation: "Debt Consolidation",
    educational: "Educational",
    home_improvement: "Home Improvement",
    major_purchase: "Major Purchase",
    small_business: "Small Business",
    all_other: "All Other",
  };

  return (
    <div>
      {/* Page Header */}
      <header className="page-header">
      <div className="d-flex justify-content-end mb-3">
        <form onSubmit={logout}>
            <button type="submit" className="btn btn-outline-danger btn-sm shadow-sm">
                Logout
            </button>
        </form>
      </div>
        <h1 className="app-title">LoanAdvisor - Loan Interest Rate Predictor</h1>
        <p className="tagline">Predict smarter. Lend better.</p>
        <hr />
      </header>

      {/* Main Layout Section */}
      <div className="main-layout">
        {/* Client List */}
        <div className="client-list-container">
          <div className="client-list-container-header">
            <h3>Client List</h3>
          </div>
          <div className="client-list">
            {clientList.map((client) => (
              <Card key={client.id} client={client} purpose_map={purpose_map} onDelete={fetchClients}/>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="form-container">
          {/* Form Header (like client list header) */}
          <div className="client-list-container-header">
            <h3>Add New Client</h3>
          </div>
          {/* Form Body */}
          <Form onClientAdded={fetchClients}/>
        </div>
      </div>
    </div>
  );
};

export default App;
