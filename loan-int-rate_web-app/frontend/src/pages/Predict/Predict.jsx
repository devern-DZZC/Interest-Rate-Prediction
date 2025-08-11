import React from 'react';
import SideNav from '../../components/SideNav';
import Form from '../../components/Form';
import './Predict.css';

const Predict = () => {
  return (
    <div className="layout">
      <SideNav />
      <div className="content">
        <header className="page-header">
          <h1>Predict Loan Interest Rate</h1>
          <p>Fill out the form to get predictions.</p>
        </header>
        <div className="form-page">
          <Form />
        </div>
      </div>
    </div>
  );
};

export default Predict;
