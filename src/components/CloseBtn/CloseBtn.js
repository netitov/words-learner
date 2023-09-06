import React from 'react';

function CloseBtn({ width, color, strokeWidth, onBtnClick, elClass }) {
  return (
    <button className={`close-btn ${elClass || ''}`} type='button' onClick={onBtnClick}>
      <svg
        viewBox='0 0 100 100'
        xmlns='http://www.w3.org/2000/svg'
        style={{ width: width || '#fff' }}
      >
        <line
          x1='0'
          x2='100'
          y1='0'
          y2='100'
          style={{ stroke: color || '#fff', strokeWidth: strokeWidth || '0.7em' }}
        />
        <line
          x1='0'
          x2='100'
          y1='100'
          y2='0'
          style={{ stroke: color || '#fff', strokeWidth: strokeWidth || '0.7em' }}
        />
      </svg>
    </button>
  );
}

export default CloseBtn;
