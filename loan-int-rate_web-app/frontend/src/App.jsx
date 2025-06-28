import React from 'react';
import Form from './components/Form';

const App = () => {
  return (
    <div className="container my-5">
      <h1 className="app-title text-center mb-3">LoanAdvisor - Loan Interest Rate Predictor</h1>
      <p className="tagline text-center mb-4">Predict smarter. Lend better.</p>
      <hr
        style={{
          border: 'none',
          height: '1px',
          backgroundColor: '#e5e7eb',
          width: '90%',
          margin: '0 auto 1.5rem auto',
        }}
      />
      <div className="row justify-content-center">
        <div className="col-md-7">
          <Form />
        </div>
      </div>
    </div>
  );
};

export default App;
