// src/components/StressTrendChart.jsx

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function StressTrendChart({ data }) {
  if (!data || data.length < 2) {
    return (
      <div className="glass-card p-6 max-w-2xl mx-auto w-full text-center">
        <p className="opacity-70">
          Check in for a few more days to see your stress trend.
        </p>
      </div>
    );
  }

  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Stress Level',
        data: data.map(d => d.stress),
        borderColor: 'rgb(239, 68, 68)', // A reddish color for stress
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3, // Makes the line curved
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Stress Level Trend',
        font: {
          size: 18,
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5, // Stress is on a 1-5 scale
      },
    },
  };

  return (
    <div className="glass-card p-6 max-w-2xl mx-auto w-full hover-scale transition-all duration-500">
      <Line options={options} data={chartData} />
    </div>
  );
}