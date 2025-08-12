import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './Form.css';

const Form = ({ onClientAdded }) => {
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
  const [message, setMessage] = useState(null); // holds success/error message
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const setRandom = (fieldId) => {
    const randomValues = {
      logAnnInc: (Math.random() * 2.5 + 10).toFixed(2),
      dti: (Math.random() * 40).toFixed(2),
      fico: Math.floor(Math.random() * (850 - 300 + 1)) + 300,
      daysWithCrLine: (Math.random() * 15000).toFixed(1),
      revolUtil: (Math.random() * 150).toFixed(1),
      inqLast6Mon: Math.floor(Math.random() * 21),
      delinq2Years: Math.floor(Math.random() * 11),
      pubRec: Math.floor(Math.random() * 6),
    };

    if (randomValues[fieldId] !== undefined) {
      setValue(fieldId, randomValues[fieldId]);
    }
  };

  // eslint-disable-next-line no-undef
  const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8001';

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(null), 3000); // auto-hide after 3s
  };

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        console.log(result.prediction);
        if (onClientAdded) onClientAdded();
        reset();
        showMessage("Client saved successfully!", "success");
      } else {
        showMessage("Failed to save client. Please try again.", "error");
      }
    } catch (error) {
      showMessage("Network error. Please check your connection.", "error");
    }
  };

  return (
    <div className="client-form-body">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control"
            {...register("name", { required: true })} />
          {errors.name && <p className="form-error">Full name required</p>}
        </div>

        <div className="mb-3">
          <label className="form-label">Meets Bank's Credit Policy</label>
          <select className="form-select" {...register("creditPolicy", { required: true })}>
            <option value="">Select</option>
            <option value="0">Yes</option>
            <option value="1">No</option>
          </select>
          {errors.creditPolicy && <p className="form-error">This field is required</p>}
        </div>

        <div className="mb-3">
          <label className="form-label">Loan Purpose</label>
          <select className="form-select" {...register("purpose", { required: true })}>
            <option value="">Select</option>
            <option value="credit_card">Credit Card</option>
            <option value="debt_consolidation">Debt Consolidation</option>
            <option value="educational">Educational</option>
            <option value="home_improvement">Home Improvement</option>
            <option value="major_purchase">Major Purchase</option>
            <option value="small_business">Small Business</option>
            <option value="all_other">All Other</option>
          </select>
          {errors.purpose && <p className="form-error">This field is required</p>}
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
            <div className="input-group align-items-center">
              <input
                type="number"
                step={field.step || '1'}
                min={field.min}
                max={field.max}
                className="form-control w-50"
                {...register(field.name, { required: true })}
              />
              <button
                type="button"
                className="btn-random"
                onClick={() => setRandom(field.name)}
              >
                Random
              </button>
            </div>
            {errors[field.name] && <p className="form-error">This field is required</p>}
          </div>
        ))}

        <div className="mb-3">
          <label className="form-label">Loan Not Fully Paid?</label>
          <select className="form-select" {...register("notFullyPaid", { required: true })}>
            <option value="">Select</option>
            <option value="0">Yes</option>
            <option value="1">No</option>
          </select>
          {errors.notFullyPaid && <p className="form-error">This field is required</p>}
        </div>

        <div className="form-button-center text-center">
          <button type="submit" id="predictBtn" className="btn btn-success">
            Predict & Save
          </button>
        </div>
        {message && (
        <div className={`form-message ${messageType}`}>
          {message}
        </div>
      )}

      </form>
    </div>
  );
};

export default Form;
