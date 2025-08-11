import React, { useMemo } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './InsightsPanel.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const InsightsPanel = ({ customers }) => {
  // Compute average predicted interest rate
  const avgRate = useMemo(() => {
    if (!customers.length) return 0;
    const total = customers.reduce((sum, c) => sum + (c.intRate || 0), 0);
    return (total / customers.length).toFixed(2);
  }, [customers]);

  // FICO score distribution
  const ficoBuckets = useMemo(() => {
    const buckets = { '<650': 0, '650–699': 0, '700–749': 0, '750+': 0 };
    customers.forEach(c => {
      if (c.fico < 650) buckets['<650']++;
      else if (c.fico < 700) buckets['650–699']++;
      else if (c.fico < 750) buckets['700–749']++;
      else buckets['750+']++;
    });
    return buckets;
  }, [customers]);

  const ficoData = {
    labels: Object.keys(ficoBuckets),
    datasets: [{
      label: 'Number of Customers',
      data: Object.values(ficoBuckets),
      backgroundColor: '#8739F9'
    }]
  };

  // Loan purpose breakdown
  const purposeCounts = useMemo(() => {
    const counts = {};
    customers.forEach(c => {
      const purpose = c.purpose || 'Unknown';
      counts[purpose] = (counts[purpose] || 0) + 1;
    });
    return counts;
  }, [customers]);

  const purposeData = {
    labels: Object.keys(purposeCounts),
    datasets: [{
      label: 'Loan Purpose',
      data: Object.values(purposeCounts),
      backgroundColor: [
        "#E9DAFF", // very light lavender
        "#C7A6FF", // light purple
        "#A26BFF", // medium-light purple
        "#8739F9", // base purple
        "#6E1FCC", // slightly darker
        "#5416A3", // dark purple
        "#3B0D7A"  
      ]
    }]
  };

  return (
    <div className="insights-panel">
      <div className="insight-card">
        <h3>Average Predicted Rate</h3>
        <p className="insight-value">{avgRate}%</p>
      </div>

      <div className="chart-container">
        <h4>FICO Score Distribution</h4>
        <Bar data={ficoData} />
      </div>

      <div className="chart-container">
        <h4>Loan Purpose Breakdown</h4>
        <Pie data={purposeData} />
      </div>
    </div>
  );
};

export default InsightsPanel;
