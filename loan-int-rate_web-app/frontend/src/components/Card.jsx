import React from 'react';

const Card = ({ client, purpose_map }) => {
  if (!client) return null;

  return (
    <div className="client-card">
      {/* Header */}
      <div className="client-card-header">
        <h5 className="client-card-title">{client.name}</h5>
      </div>

      {/* Body */}
      <div className="client-card-body">
        <p className="client-card-text"><strong>Meets Bank's Credit Policy:</strong> {client.creditPolicy}</p>
        <p className="client-card-text"><strong>Purpose:</strong> {purpose_map ? purpose_map[client.purpose] : client.purpose}</p>
        <p className="client-card-text"><strong>DTI:</strong> {client.dti}</p>
        <p className="client-card-text"><strong>FICO:</strong> {client.fico}</p>
        <p className="client-card-text"><strong>Log Annual Income:</strong> {client.logAnnInc}</p>
        <p className="client-card-text"><strong>Days with Credit Line:</strong> {client.daysWithCrLine}</p>
        <p className="client-card-text"><strong>Revolving Utilization:</strong> {client.revolUtil}</p>
        <p className="client-card-text"><strong>Inquiries Last 6 Months:</strong> {client.inqLast6Mon}</p>
        <p className="client-card-text"><strong>Delinquency (2 yrs):</strong> {client.delinq2Years}</p>
        <p className="client-card-text"><strong>Public Record:</strong> {client.pubRec}</p>
        <p className="client-card-text"><strong>Not Fully Paid:</strong> {client.notFullyPaid}</p>
        <p className="client-card-text">
          <strong>Predicted Interest Rate:</strong>{' '}
          <span className="client-card-badge">{client.intRate}%</span>
        </p>

        {/* Delete Button */}
        <form onSubmit={(e) => {
          e.preventDefault();
          // Handle delete logic here if needed
        }}>
          <button type="submit" className="client-card-delete">Delete</button>
        </form>
      </div>
    </div>
  );
};

export default Card;
