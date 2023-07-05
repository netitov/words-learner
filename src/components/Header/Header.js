import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import arrows from '../../images/Arrows.svg';

function Header() {
  const [activeMenu, setActiveMenu] = useState(false);
  return (
    <header>
      <nav className='nav header__nav'>
        <ul className={`nav__ul${activeMenu ? ' nav__ul_active' : ''}`}>

          <li className={`nav__li`}>
            <Link to='/'>
              Translate
            </Link>
          </li>

          <li className={`nav__li`}>
            <Link to='/'>
              Usage
            </Link>
          </li>

          <li className={`nav__li nav__li_logo`}>
            <Link to='/'>
              <span>WORDS</span> Learner
              <img className="nav__img" src={arrows} alt="arrows"></img>
            </Link>
          </li>

          <li className={`nav__li`}>
            <Link to='/'>
              Learn
            </Link>
          </li>

          <li className={`nav__li`}>
            <Link to='/'>
              Account
            </Link>
          </li>

        </ul>
      </nav>
    </header>
  )
}

export default Header;
