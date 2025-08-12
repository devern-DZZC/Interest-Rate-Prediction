import { Bar } from 'react-chartjs-2';

const ShapImportanceChart = ({ shapValues, featureNames }) => {
  const absValues = shapValues.map(val => Math.abs(val));

  const data = {
    labels: featureNames,
    datasets: [
      {
        label: 'Importance',
        data: absValues,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    scales: { x: { beginAtZero: true } },
    plugins: { legend: { display: false } },
  };

  return <Bar data={data} options={options} />;
};

export default ShapImportanceChart;
