import React from 'react';

const Form = () => {
  const setRandom = (fieldId) => {
    const randomValues = {
      logAnnInc: (Math.random() * 2.5 + 10).toFixed(2), // 10.0 to 12.5
      dti: (Math.random() * 40).toFixed(2),              // 0 to 40
      fico: Math.floor(Math.random() * (850 - 300 + 1)) + 300, // 300 to 850
      daysWithCrLine: (Math.random() * 15000).toFixed(1), // 0 to 15000
      revolUtil: (Math.random() * 150).toFixed(1),       // 0 to 150
      inqLast6Mon: Math.floor(Math.random() * 21),       // 0 to 20
      delinq2Years: Math.floor(Math.random() * 11),      // 0 to 10
      pubRec: Math.floor(Math.random() * 6),              // 0 to 5
    };

    const input = document.getElementById(fieldId);
    if (input && randomValues[fieldId] !== undefined) {
      input.value = randomValues[fieldId];
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Prediction submitted (add backend logic)');
  };

  return (
    <div className="client-form-body">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control" name="name" required />
        </div>

        <div className="mb-3">
          <label className="form-label">Meets Bank's Credit Policy</label>
          <select className="form-select" name="creditPolicy" required>
            <option value="">Select</option>
            <option value="0">Yes</option>
            <option value="1">No</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Loan Purpose</label>
          <select className="form-select" name="purpose" required>
            <option value="">Select</option>
            <option value="credit_card">Credit Card</option>
            <option value="debt_consolidation">Debt Consolidation</option>
            <option value="educational">Educational</option>
            <option value="home_improvement">Home Improvement</option>
            <option value="major_purchase">Major Purchase</option>
            <option value="small_business">Small Business</option>
            <option value="all_other">All Other</option>
          </select>
        </div>

        {[
          { label: 'Log of Annual Income', name: 'logAnnInc', step: '0.01' },
          { label: 'Debt-to-Income Ratio (DTI)', name: 'dti', step: '0.01' },
          { label: 'FICO Credit Score (300–850)', name: 'fico', min: 300, max: 850 },
          { label: 'Credit Line Age (in Days)', name: 'daysWithCrLine', step: '0.1' },
          { label: 'Revolving Line Utilization Rate (%)', name: 'revolUtil', step: '0.1' },
          { label: 'Credit Inquiries in Last 6 Months', name: 'inqLast6Mon' },
          { label: 'Delinquencies in Past 2 Years', name: 'delinq2Years' },
          { label: 'Number of Public Records', name: 'pubRec' },
        ].map((field) => (
          <div className="mb-3" key={field.name}>
            <label className="form-label">{field.label}</label>
            <div className="input-group">
              <input
                type="number"
                step={field.step || '1'}
                min={field.min}
                max={field.max}
                className="form-control"
                name={field.name}
                id={field.name}
                required
              />
              <button
                type="button"
                className="btn-random"
                onClick={() => setRandom(field.name)}
              >
                Random
              </button>
            </div>
          </div>
        ))}

        <div className="mb-3">
          <label className="form-label">Loan Not Fully Paid?</label>
          <select className="form-select" name="notFullyPaid" required>
            <option value="">Select</option>
            <option value="0">Yes</option>
            <option value="1">No</option>
          </select>
        </div>

        <div className="form-button-center text-center">
          <button type="submit" id="predictBtn" className="btn btn-success">
            Predict & Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
