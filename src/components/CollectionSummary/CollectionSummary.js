import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function CollectionSummary({ totalWords }) {

  const data = {
    labels: ['learned words', 'words to learn'],

    datasets: [
      {
        data: [0, totalWords === 0 ? 0 : totalWords - 0],
        backgroundColor: [
          '#fcc554', //#ffd987
          '#ffd98726', //# ffdd9770
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    aspectRatio: 3,
    order: 1,
    z: 10,
    plugins: {
      legend: {
        display: false,
      }
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    },
    rotation: -90,
    circumference: 180,
    cutout: '83%'
  }

  return (
    <div className='c-sum'>

      <div className='c-sum__card'>
        <h3 className='c-sum__value'>{totalWords}</h3>
        <p className='c-sum__category'>total words</p>
      </div>

      <div className='c-sum__card'>
        <h3 className='c-sum__value'>1</h3>
        <p className='c-sum__category'>learned words</p>
      </div>

      {/* show chart if words amount more than 0 */}
      {totalWords > 0 &&
        <div className='c-sum__card'>
          <Doughnut data={data} options={options}/>
          <span className='c-sum__result'>{totalWords !== 0 ? Math.round(1 / totalWords * 100) : 0}%</span>
          <p className='c-sum__category'>% learned words</p>
        </div>
      }

    </div>
  )
}

export default CollectionSummary;
