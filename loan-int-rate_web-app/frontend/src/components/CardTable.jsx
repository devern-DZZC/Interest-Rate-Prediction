import React from 'react';
import './CardTable.css';

const CardTable = ({ customers, onView, onDelete }) => {
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
          // Fix NaN% by ensuring predictedInterestRate is a valid number
          const rate = parseFloat(cust.intRate);
          const formattedRate =
            !isNaN(rate) ? `${rate.toFixed(2)}%` : 'N/A';

          return (
            <tr key={cust.id}>
              <td>{cust.fullName || cust.name || 'N/A'}</td>
              <td>{formattedRate}</td>
              <td>
                <button
                  className="btn-view"
                  onClick={() => onView(cust.id)}
                  aria-label={`View details of ${cust.fullName}`}
                >
                  View
                </button>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(cust.id)}
                  aria-label={`Delete client ${cust.fullName}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default CardTable;
