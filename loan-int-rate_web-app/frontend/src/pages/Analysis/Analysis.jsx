import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ShapWaterfallChart from '../../components/ShapWaterfallChart';
import SideNav from '../../components/SideNav';
import ShapImportanceChart from '../../components/ShapImportanceChart';
import './Analysis.css';

const API_BASE_URL = 
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV === 'production'
  ? 'https://loan-advisor.azurewebsites.net'
  : 'http://localhost:5004';

const Analysis = () => {
  const { clientId: paramClientId } = useParams();
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(paramClientId || '');
  const [clientData, setClientData] = useState(null);
  const [shapValues, setShapValues] = useState([]);
  const [featureNames, setFeatureNames] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingClientData, setLoadingClientData] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoadingClients(true);
    fetch(`${API_BASE_URL}/clients`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch clients');
        return res.json();
      })
      .then(data => {
        setClients(data);
        setLoadingClients(false);
        if (!selectedClientId && data.length > 0) {
          setSelectedClientId(data[0].id); // auto-select first client
        }
      })
      .catch(err => {
        setError(err.message);
        setLoadingClients(false);
      });
  }, []);

  useEffect(() => {
    if (!selectedClientId) return;
    setLoadingClientData(true);
    setError(null);

    fetch(`${API_BASE_URL}/clients/${selectedClientId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch client data');
        return res.json();
      })
      .then(data => {
        console.log('Client data:', data);
        setClientData(data);

        if (data.shap_values && data.feature_names) {
          setShapValues(data.shap_values);
          setFeatureNames(data.feature_names);
        } else {
          setShapValues([]);
          setFeatureNames([]);
        }
        setLoadingClientData(false);
      })
      .catch(err => {
        setError(err.message);
        setLoadingClientData(false);
      });
  }, [selectedClientId]);

  const yesNo = (val) => (val === 1 ? 'Yes' : val === 0 ? 'No' : 'N/A');

  return (
    <div className="analysis-page">
      <SideNav />
      <main className="analysis-main">
        <h1>Loan Analysis</h1>

        {error && <div className="error-message">{error}</div>}

        {loadingClients ? (
          <p>Loading clients...</p>
        ) : (
          <>
            <label htmlFor="client-select">Select Client:</label>
            <select
              id="client-select"
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
            >
              <option value="">-- Select a Client --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name || c.fullName || c.id}
                </option>
              ))}
            </select>
          </>
        )}

        {loadingClientData && <p>Loading client data...</p>}

        {clientData && !loadingClientData && (
          <section className="client-info">
            <h2>{clientData.name || clientData.fullName} — Loan Data</h2>
            <ul>
              <li>Credit Policy: {yesNo(clientData.creditPolicy ?? clientData.credit_policy)}</li>
              <li>Purpose: {clientData.purpose ?? 'N/A'}</li>
              <li>DTI: {clientData.dti ?? 'N/A'}</li>
              <li>FICO: {clientData.fico ?? 'N/A'}</li>
              <li>Log Annual Income: {clientData.logAnnInc ?? clientData.log_ann_inc ?? 'N/A'}</li>
              <li>Days with Credit Line: {clientData.daysWithCrLine ?? clientData.days_with_cr_line ?? 'N/A'}</li>
              <li>Revolving Utilization: {clientData.revolUtil ?? clientData.revol_util ?? 'N/A'}</li>
              <li>Inquiries Last 6 Months: {clientData.inqLast6Mon ?? clientData.inq_last_6_mon ?? 'N/A'}</li>
              <li>Delinquencies in 2 Years: {yesNo(clientData.delinq2Years ?? clientData.delinq_2_years)}</li>
              <li>Public Records: {clientData.pubRec ?? clientData.pub_rec ?? 'N/A'}</li>
              <li>Not Fully Paid: {yesNo(clientData.notFullyPaid ?? clientData.not_fully_paid)}</li>
              <li>Predicted Interest Rate: {clientData.intRate ? clientData.intRate.toFixed(2) : 'N/A'}%</li>
            </ul>
          </section>
        )}

        {shapValues.length > 0 && featureNames.length > 0 && !loadingClientData && (
          <section className="shap-insights">
            <h2>SHAP Feature Impact</h2>
            <ShapImportanceChart shapValues={shapValues} featureNames={featureNames} />
            <ShapWaterfallChart shapValues={shapValues} featureNames={featureNames} />
          </section>
        )}
      </main>
    </div>
  );
};

export default Analysis;