import React from 'react';
import { Link } from 'react-router-dom';
import arrows from '../../images/Arrows.svg';

function AuthHeader() {

  return (
    <header className='auth-header'>
      <div className='logo auth-header__logo'>
        <Link to='/'>
          <span>WORDS</span> Learner
          <img className='logo__img' src={arrows} alt='arrows'></img>
        </Link>
      </div>
    </header>
  )
}

export default AuthHeader;
