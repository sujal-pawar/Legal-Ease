import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: {
    dates: string[];
    resolved: number[];
    new: number[];
  };
  height?: number;
  title?: string;
}

export function LineChart({ data, height = 300, title }: LineChartProps) {
  const options = useMemo<ChartOptions<'line'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: !!title,
        text: title
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.3 // Smooth curves
      },
      point: {
        radius: 3,
        hitRadius: 10,
        hoverRadius: 5,
      }
    }
  }), [title]);

  const chartData = useMemo<ChartData<'line'>>(() => ({
    labels: data.dates,
    datasets: [
      {
        label: 'Resolved Cases',
        data: data.resolved,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        fill: true,
        cubicInterpolationMode: 'monotone'
      },
      {
        label: 'New Cases',
        data: data.new,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        fill: true,
        cubicInterpolationMode: 'monotone'
      }
    ]
  }), [data]);

  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <Line 
        options={options} 
        data={chartData}
        aria-label={title || "Line chart"}
      />
    </div>
  );
}
