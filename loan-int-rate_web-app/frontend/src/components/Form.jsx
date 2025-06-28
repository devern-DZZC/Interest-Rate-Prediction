import React from 'react';

const Form = () => {
  // Function to randomly set values for specific fields
  const setRandom = (fieldId) => {
    const randomValues = {
      logAnnInc: (Math.random() * 4 + 9).toFixed(2),         // 9–13
      dti: (Math.random() * 30).toFixed(2),                  // 0–30%
      fico: Math.floor(Math.random() * 551) + 300,           // 300–850
      daysWithCrLine: Math.floor(Math.random() * 3650),      // up to 10 years
      revolUtil: (Math.random() * 100).toFixed(1),           // 0–100%
      inqLast6Mon: Math.floor(Math.random() * 10),
      delinq2Years: Math.floor(Math.random() * 5),
      pubRec: Math.floor(Math.random() * 3)
    };

    const input = document.getElementById(fieldId);
    if (input && randomValues[fieldId] !== undefined) {
      input.value = randomValues[fieldId];
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add form submission logic here
    alert("Prediction submitted (add backend logic)");
  };

  return (
    <div>
      <div className="col-md-5">
        <div className="card shadow-sm">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">Add New Client</h5>
          </div>
          <div className="card-body" style={{ maxHeight: '550px', overflowY: 'auto' }}>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" name="name" required />
              </div>

              <div className="mb-3">
                <label className="form-label">Meets Bank's Credit Policy</label>
                <select className="form-select" name="creditPolicy" required>
                  <option value="0">Yes</option>
                  <option value="1">No</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Loan Purpose</label>
                <select className="form-select" name="purpose" required>
                  <option value="credit_card">Credit Card</option>
                  <option value="debt_consolidation">Debt Consolidation</option>
                  <option value="educational">Educational</option>
                  <option value="home_improvement">Home Improvement</option>
                  <option value="major_purchase">Major Purchase</option>
                  <option value="small_business">Small Business</option>
                  <option value="all_other">All Other</option>
                </select>
              </div>

              {/* Reusable field with Random Button */}
              {[
                { label: "Log of Annual Income", name: "logAnnInc", step: "0.01" },
                { label: "Debt-to-Income Ratio (DTI)", name: "dti", step: "0.01" },
                { label: "FICO Credit Score (300–850)", name: "fico", min: 300, max: 850 },
                { label: "Credit Line Age (in Days)", name: "daysWithCrLine", step: "0.1" },
                { label: "Revolving Line Utilization Rate (%)", name: "revolUtil", step: "0.1" },
                { label: "Credit Inquiries in Last 6 Months", name: "inqLast6Mon" },
                { label: "Delinquencies in Past 2 Years", name: "delinq2Years" },
                { label: "Number of Public Records", name: "pubRec" }
              ].map((field) => (
                <div className="mb-3" key={field.name}>
                  <label className="form-label">{field.label}</label>
                  <div className="input-group">
                    <input
                      type="number"
                      step={field.step || "1"}
                      min={field.min}
                      max={field.max}
                      className="form-control"
                      name={field.name}
                      id={field.name}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-random"
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
        </div>
      </div>
    </div>
  );
};

export default Form;
