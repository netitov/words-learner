import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ChartDataLabels,
);

//ChartJS.defaults.font.family = "'Noto Sans Display', 'Sans-serif', 'Arial', 'Helvetica'";
ChartJS.defaults.color = '#bebebe'


function BarChart({ title, labels, dataset1, dataset2 }) {


  const options = {
    indexAxis: 'y',
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
      datalabels: {
        display: false,
        anchor: 'end',
        align: 'end',
        font: {
          size: 13,
        },
        labels: {
          value: {
            color: '#ffd987',
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawTicks: false,
        },
        ticks: {
          display: false
        },
        stacked: true,
      },
      y: {
        grid: {
          display: true,
          color: '#4141412e',
          drawTicks: false,
        },
        ticks: {
          /* display: false, */
          color: '#bebebe'
        },
        stacked: true,
      },
    },
    layout: {
      padding: {
        left: 10,
        rigt: 10,
        top: 10,
        bottom: 0,
      },
    },
    redraw: false,

  };

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'learned words',
        data: dataset1,
        backgroundColor: '#7da1a9',
        barThickness: 'flex',
        maxBarThickness: 20,
        borderRadius: [20, 20, 20, 20]

      },
      {
        label: 'not learned',
        data: dataset2,
        backgroundColor: '#7da1a92e',
        barThickness: 'flex',
        maxBarThickness: 20,
        borderRadius: [20, 20, 20, 20]
      }

    ],
  };

  return (
    <div className='bar-chart'>
      <h3>{title}</h3>
      <Bar
        data={data}
        options={options}
      />

    </div>
  );
}

export default BarChart;
