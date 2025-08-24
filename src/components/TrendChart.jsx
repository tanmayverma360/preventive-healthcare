// src/components/TrendChart.jsx

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

export default function TrendChart({ historicalData, metric, title, color }) {
  // Show a message if there isn't enough data to plot a meaningful chart
  if (!historicalData || historicalData.length < 2) {
    return (
      <div className="glass-card p-6 w-full text-center">
        <p className="opacity-70">
          Check in for a few more days to see your {metric} trend.
        </p>
      </div>
    );
  }

  // Prepare the data for the chart
  const chartData = {
    labels: historicalData.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: `${title} Levels`,
        data: historicalData.map(d => d[metric]),
        borderColor: color,
        backgroundColor: `${color}80`, // Add transparency to the color
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Configure the chart's appearance and options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide the legend as the title is clear enough
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 20,
        },
        padding: {
          bottom: 20,
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="glass-card p-4 w-full hover-scale transition-all duration-500">
      <Line options={options} data={chartData} />
    </div>
  );
}