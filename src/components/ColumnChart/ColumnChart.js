import React from 'react';

function ColumnChart(props) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='30' height='25'>
      <rect x='2' y='20' width='5' height='5' rx='2' fill={props.value >= 0 ? '#127386' : 'none'} stroke='#757575' strokeWidth='0.3' />
      <rect x='9' y='15' width='5' height='10' rx='2' fill={props.value >= 2 ? '#127386' : 'none'} stroke='#757575' strokeWidth='0.3' />
      <rect x='16' y='10' width='5' height='15' rx='2' fill={props.value >= 4 ? '#127386' : 'none'} stroke='#757575' strokeWidth='0.3' />
      <rect x='23' y='5' width='5' height='20' rx='2' fill={props.value >= 6 ? '#127386' : 'none'} stroke='#757575' strokeWidth='0.3' />
    </svg>
  )
}

export default ColumnChart;
