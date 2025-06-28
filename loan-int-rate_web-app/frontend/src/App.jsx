import React from 'react';
import Card from './components/Card';
import Form from './components/Form';

const App = () => {
  // Sample client data
  const client = {
    name: "Devern Chattergoon",
    creditPolicy: "Yes",
    purpose: "credit_card",
    dti: 0.25,
    fico: 720,
    logAnnInc: 10.5,
    daysWithCrLine: 1500,
    revolUtil: 20.5,
    inqLast6Mon: 1,
    delinq2Years: 0,
    pubRec: 0,
    notFullyPaid: "No",
    intRate: 7.5,
  };

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
            <Card client={client} purpose_map={purpose_map} />
            <Card client={client} purpose_map={purpose_map} />
            <Card client={client} purpose_map={purpose_map} />
          </div>
        </div>

        {/* Form Container */}
        <div className="form-container">
          {/* Form Header (like client list header) */}
          <div className="client-list-container-header">
            <h3>Add New Client</h3>
          </div>
          {/* Form Body */}
          <Form />
        </div>
      </div>
    </div>
  );
};

export default App;
