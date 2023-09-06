import React from 'react';
import { MdTranslate } from 'react-icons/md';
import { TfiStatsUp } from 'react-icons/tfi';

function Promo() {
  return (
    <div className='promo'>
      <div className='promo__container'>
        <h1>
          EXPAND YOUR VOCABULARY
          <br />
          WITH <span>WORDS LEARNER</span>
        </h1>

        <div className='promo__add-info'>
          <div>
            <span>Find</span>
            <span>&#x2022;</span>
            <span>Learn</span>
            <span>&#x2022;</span>
            <span>Select common</span>
          </div>
          <p>English words</p>
          <p>Track your progress</p>
        </div>

        <MdTranslate size={200} className='promo__svg promo__svg_right' />
        <TfiStatsUp size={200} className='promo__svg promo__svg_left' />
      </div>
    </div>
  );
}

export default Promo;
