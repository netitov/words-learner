import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

function HorizontalChart(props) {

  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,

  );

  ChartJS.defaults.font.family = "'Noto Sans Display', 'Sans-serif', 'Arial', 'Helvetica'";


  const options = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 0,
      },
    },
    responsive: true,
    plugins: {

      title: {
        display: false,
        text: 'Chart.js Horizontal Bar Chart',
      },
    },
    scales: {
      y: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 15,
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawTicks: false,
        },
        suggestedMin: 0,
        suggestedMax: 7,
      },
      xAxis2: {
        type: 'category',
        labels: ['very low', '', 'low', '', 'high', '', 'very high', ''],
        ticks: {
          autoSkip: false,
          maxRotation: 0,
        }
      }
  },

  };

  const data = {
    labels: props.translFreqs.map((i) => i.word),
    datasets: [
      {
        data: props.translFreqs.map((i) => i.fr),
        backgroundColor: '#fcc5546e',
        barThickness: 'flex',
        maxBarThickness: 30,
      },
    ],
  };

  return (
    <div className={`chart-wrapper${props.translFreqs.length !== 0 ? ' chart-wrapper_active' : ''}`}>
      <h2 className='chart-wrapper__heading'>Frequency
      </h2>
      <div className='horizontal-chart'>
        <Bar
          data={data}
          options={options}
        />
      </div>
    </div>
  )
}

export default HorizontalChart;
