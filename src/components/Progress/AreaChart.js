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
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Line } from 'react-chartjs-2';

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

ChartJS.defaults.font.family = "'Noto Sans Display', 'Sans-serif', 'Arial', 'Helvetica'";

function AreaChart({ title, labels, values }) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false,
      },
      title: {
        display: false,
        /* padding: {
          bottom: 25,
        },
        font: {
          size: 14,
        }, */
      },
      datalabels: {
        display: true,
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
          padding: 10,
          color: '#bebebe',
        },
      },
      y: {
        grid: {
          display: true,
          color: '#4141412e',
          drawTicks: false,
        },
        ticks: {
          display: false,
        },
      },
    },
    layout: {
      padding: {
        left: 10,
        rigt: 10,
        top: 30,
        bottom: 0,
      },
    },
    redraw: false,
  };

  const data = {
    labels,
    datasets: [
      {
        /* label: option, */
        data: values,
        borderRadius: 7,
        borderColor: '#ffd987',
        pointBackgroundColor: '#fff',
        pointBorderColor: '#ffd987',
        pointRadius: 4,
        backgroundColor: ({ chart: { ctx } }) => {
          const bg = ctx.createLinearGradient(0, 0, 0, 400);
          bg.addColorStop(0, '#ffd98717'); //
          bg.addColorStop(0.5, '#ffd98708');
          return bg;
        },
        lineTension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <div className='area-chart'>
      <h3>{title}</h3>
      <Line data={data} options={options} />
    </div>
  );
}

export default AreaChart;
