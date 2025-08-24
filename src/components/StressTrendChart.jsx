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
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.5)',
        tension: 0.3,
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
      // ADDED THIS TOOLTIP CONFIGURATION
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#333',
        bodyColor: '#666',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              // Adding a rating description for stress
              label += `${context.parsed.y} / 5`;
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
      },
    },
  };

  return (
    <div className="glass-card p-6 max-w-2xl mx-auto w-full hover-scale transition-all duration-500">
      <Line options={options} data={chartData} />
    </div>
  );
}