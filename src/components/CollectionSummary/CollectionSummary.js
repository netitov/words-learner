import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import RefTooltip from '../RefTooltip/RefTooltip';

ChartJS.register(ArcElement, Tooltip, Legend);

function CollectionSummary({ totalWords, learnedWords }) {

  const data = {
    labels: ['learned words', 'words to learn'],

    datasets: [
      {
        data: [learnedWords, totalWords === 0 ? 0 : totalWords - learnedWords],
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
      },
      datalabels: {
        display: false
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
        <h3 className='c-sum__value'>{learnedWords}</h3>
        <p className='c-sum__category'>learned words</p>
        <RefTooltip color='#dbecec' class='c-sum__tlt'>
          <p>A word is learned once the quiz is passed at least 3 times</p>
        </RefTooltip>
      </div>

      {/* show chart if words amount more than 0 */}
      {totalWords > 0 &&
        <div className='c-sum__card c-sum__card_chart'>
          <Doughnut data={data} options={options}/>
          <span className='c-sum__result'>{totalWords !== 0 ? Math.round(learnedWords / totalWords * 100) : 0}%</span>
          <p className='c-sum__category'>% learned words</p>
        </div>
      }

    </div>
  )
}

export default CollectionSummary;
