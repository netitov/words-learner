import React, { useState } from 'react';
import promoImg from '../../images/Picture.svg';

function Main() {

  const [btnActive, setBtnActive] = useState(false);

  function handleBtn() {
    setBtnActive(!btnActive);
  }

  return (
    <main className='main'>
      <div className='main__promo promo'>
        <img className='promo__img' src={promoImg} alt='people'></img>
        <div className='promo__container'>
          <h1>What is the idea?</h1>
          <p>Find and learn common english words and track your progress.</p>
          <button className={`promo__btn${btnActive ? ' promo__btn_active' : ''}`} type="button" onClick={handleBtn}>
            <p>Watch more</p>
            <span className='promo__arrow'></span>
          </button>
        </div>
      </div>
    </main>
  )
}

export default Main;
