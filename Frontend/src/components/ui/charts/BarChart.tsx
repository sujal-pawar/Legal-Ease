import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  data: {
    type: string;
    count: number;
  }[];
  height?: number;
  title?: string;
}

export function BarChart({ data, height = 300, title }: BarChartProps) {
  const options = useMemo<ChartOptions<'bar'>>(() => ({
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
      }
    }
  }), [title]);

  const chartData = useMemo<ChartData<'bar'>>(() => ({
    labels: data.map(item => item.type),
    datasets: [
      {
        label: 'Number of Cases',
        data: data.map(item => item.count),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
        borderRadius: 5,
        barThickness: 30,
        maxBarThickness: 35
      }
    ]
  }), [data]);

  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <Bar 
        options={options} 
        data={chartData}
        aria-label={title || "Bar chart"}
      />
    </div>
  );
}
