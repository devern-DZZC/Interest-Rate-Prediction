import { Pie } from 'react-chartjs-2';

const ShapDirectionPie = ({ shapValues }) => {
  const positiveImpact = shapValues.filter(v => v > 0).reduce((a, b) => a + b, 0);
  const negativeImpact = Math.abs(
    shapValues.filter(v => v < 0).reduce((a, b) => a + b, 0)
  );

  const data = {
    labels: ['Rate Increasing', 'Rate Decreasing'],
    datasets: [
      {
        data: [positiveImpact, negativeImpact],
        backgroundColor: ['rgba(255, 99, 132, 0.6)', 'rgba(54, 162, 235, 0.6)'],
        borderColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={data} />;
};

export default ShapDirectionPie;
