import React from 'react';
import { useForm } from 'react-hook-form';

const Form = ({onClientAdded}) => {
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

    const value = randomValues[fieldId]
    if (value !== undefined) {
      setValue(fieldId, value);
    }
  };

  const {register, handleSubmit, formState: {errors}, setValue, reset} = useForm();

  const onSubmit = async (data) => {
    const response = await fetch("http://localhost:5000/predict", {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(data)
    })

    const result = await response.json()

    if (response.ok){
        console.log(result.prediction)
        if(onClientAdded) onClientAdded()
        reset()
    }else{
        alert("Prediction failed.")
    }
  }

  return (
    <div className="client-form-body">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-control" name="name"
          {...register("name", {required: true})} />
          {errors.name && <p>Full name required</p>}
        </div>

        <div className="mb-3">
          <label className="form-label">Meets Bank's Credit Policy</label>
          <select className="form-select" name="creditPolicy" {...register("creditPolicy", {required:true})}>
            <option value="">Select</option>
            <option value="0">Yes</option>
            <option value="1">No</option>
          </select>
          {errors.creditPolicy && <p>This field is required</p>}
        </div>

        <div className="mb-3">
          <label className="form-label">Loan Purpose</label>
          <select className="form-select" name="purpose" {...register("purpose", {required: true})}>
            <option value="">Select</option>
            <option value="credit_card">Credit Card</option>
            <option value="debt_consolidation">Debt Consolidation</option>
            <option value="educational">Educational</option>
            <option value="home_improvement">Home Improvement</option>
            <option value="major_purchase">Major Purchase</option>
            <option value="small_business">Small Business</option>
            <option value="all_other">All Other</option>
          </select>
          {errors.purpose && <p>This field is required</p>}
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
                {...register(field.name, {required:true})}
              />
              {errors[field.name] && <p>This field is required</p>}
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
          <select className="form-select" name="notFullyPaid" {...register("notFullyPaid", {required:true})}>
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
