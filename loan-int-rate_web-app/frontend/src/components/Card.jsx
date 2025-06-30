import React from 'react';

const Card = ({ client, purpose_map, onDelete }) => {
  if (!client) return null;


  const handleDelete = async (e, id) => {
    e.preventDefault()

    const response = await fetch(`http://localhost:5000/delete/${id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        credentials: 'include'
    })

    if(response.ok){
        if(onDelete) onDelete();
    }else{
        console.log('Failed to delete client')
    }
  }

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
          <button onClick={(e) => handleDelete(e, client.id)} type="submit" className="client-card-delete">Delete</button>
      </div>
    </div>
  );
};

export default Card;
