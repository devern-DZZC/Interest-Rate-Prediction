import React from 'react';
import './CardTable.css';
import { useNavigate } from 'react-router-dom';

const CardTable = ({ customers, onDelete }) => {
    const navigate = useNavigate();
  const API_BASE_URL =
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === 'production'
      ? 'https://loan-advisor.azurewebsites.net'
      : 'http://localhost:5004';

  const handleDelete = async (e, id) => {
    e.preventDefault();

    const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (response.ok) {
      if (onDelete) onDelete();
    } else {
      console.log('Failed to delete client');
    }
  };

  return (
    <table className="card-table">
      <thead>
        <tr>
          <th>Full Name</th>
          <th>Predicted Interest Rate</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((cust) => {
          const rate = parseFloat(cust.intRate);
          const formattedRate = !isNaN(rate) ? `${rate.toFixed(2)}%` : 'N/A';

          return (
            <tr key={cust.id}>
              <td>{cust.fullName || cust.name || 'N/A'}</td>
              <td>{formattedRate}</td>
              <td>
                <div className="action-buttons">
                <button
                  className="btn-analyze"
                  onClick={() => navigate(`/analysis/${cust.id}`)}
                  aria-label={`Analyze client ${cust.name}`}
                >
                  Analyze
                </button>
                  <button
                    className="btn-delete"
                    onClick={(e) => handleDelete(e, cust.id)}
                    aria-label={`Delete client ${cust.fullName || cust.name}`}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CardTable;
