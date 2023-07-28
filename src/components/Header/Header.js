import React, { useState, useEffect } from 'react';
import { Link as ScrollLink } from 'react-scroll';
import { Link } from 'react-router-dom';
import arrows from '../../images/Arrows.svg';
import Burger from '../Burger/Burger';

import { VscAccount } from 'react-icons/vsc';

function Header() {
  const [activeMenu, setActiveMenu] = useState(false);

  function toggleMenu() {
    setActiveMenu(!activeMenu);

    if (!activeMenu) {
      document.body.classList.add('unscrolled');
      document.querySelector('main').classList.add('main_unscrolled');
    } else {
      document.body.classList.remove('unscrolled');
      document.querySelector('main').classList.remove('main_unscrolled');
    }
  }

  function menuClick() {
    if (activeMenu) {
      toggleMenu();
    }
  }


  return (
    <header className={`header${activeMenu ? ' header_unscrolled' : ''}`}>
      <nav className={`nav${activeMenu ? ' nav_active' : ''}`}>
        <ul className='nav__ul'>

          <li className={`nav__li`}>
            <ScrollLink to='translator' smooth={true} onClick={menuClick}>
              Translate
            </ScrollLink>
          </li>

          <li className={`nav__li`}>
            <ScrollLink to='frequency' smooth={true} onClick={menuClick}>
              Usage
            </ScrollLink>
          </li>

          <li className={`nav__li nav__li_logo`}>
            <Link to='/' onClick={menuClick}>
              <span>WORDS</span> Learner
              <img className='nav__img' src={arrows} alt='arrows'></img>
            </Link>
          </li>

          <li className={`nav__li`}>
            <ScrollLink to='random' smooth={true} onClick={menuClick}>
              Find
            </ScrollLink>
          </li>

          <li className={`nav__li`} >
            <ScrollLink to='quiz' smooth={true} onClick={menuClick}>
              Learn
            </ScrollLink>
          </li>

          <li>
            <Link to='/login'>
              <button className='nav__acc-btn' type='button' onClick={menuClick}>
              <VscAccount />
              <span>Log in</span>
              </button>
            </Link>
          </li>

        </ul>
      </nav>

      <div className='burger-cont'>
        <div className='nav__li nav__li_logo logo'>
          <Link to='/' onClick={menuClick}>
            <span>WORDS</span> Learner
            <img className='logo__img' src={arrows} alt='arrows'></img>
          </Link>
        </div>
        <Burger
          openMenu={toggleMenu}
          active={activeMenu}
        />
      </div>


    </header>
  )
}

export default Header;
