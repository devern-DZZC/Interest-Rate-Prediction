import { Bar } from 'react-chartjs-2';

const ShapWaterfallChart = ({ shapValues, featureNames }) => {
  const data = {
    labels: featureNames,
    datasets: [
      {
        label: 'Impact on Interest Rate (%)',
        data: shapValues,
        backgroundColor: shapValues.map(val =>
          val >= 0 ? 'rgba(255, 99, 132, 0.6)' : 'rgba(54, 162, 235, 0.6)'
        ),
        borderColor: shapValues.map(val =>
          val >= 0 ? 'rgb(255, 99, 132)' : 'rgb(54, 162, 235)'
        ),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    scales: {
      x: { beginAtZero: true },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ShapWaterfallChart;
