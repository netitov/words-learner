import React, { useState } from 'react';
import { Link } from 'react-scroll';
import arrows from '../../images/Arrows.svg';
import Burger from '../Burger/Burger';

import { VscAccount } from 'react-icons/vsc';

function Header() {
  const [activeMenu, setActiveMenu] = useState(false);

  function toggleMenu() {
    setActiveMenu(!activeMenu);

    if (!activeMenu) {
      document.body.classList.add('unscrolled');
    } else {
      document.body.classList.remove('unscrolled');
    }
  }

  function menuClick() {
    if (activeMenu) {
      toggleMenu();
    }
  }


  return (
    <header>
      <nav className='nav header__nav'>
        <ul className={`nav__ul${activeMenu ? ' nav__ul_active' : ''}`}>

          <li className={`nav__li`}>
            <Link to='translator' smooth={true} onClick={menuClick}>
              Translate
            </Link>
          </li>

          <li className={`nav__li`}>
            <Link to='frequency' smooth={true} onClick={menuClick}>
              Usage
            </Link>
          </li>

          <li className={`nav__li nav__li_logo`}>
            <Link to='/' smooth={true} onClick={menuClick}>
              <span>WORDS</span> Learner
              <img className="nav__img" src={arrows} alt="arrows"></img>
            </Link>
          </li>

          <li className={`nav__li`}>
            <Link to='random' smooth={true} onClick={menuClick}>
              Find
            </Link>
          </li>

          <li className={`nav__li`} >
            <Link to='quiz' smooth={true} onClick={menuClick}>
              Learn
            </Link>
          </li>

          <li>
            <button className='nav__acc-btn' type='button' onClick={menuClick}>
            <VscAccount />
            <span>Sign in</span>
          </button>
          </li>

        </ul>
      </nav>

      <div className='nav__burger-cont'>
        <div className={`nav__li nav__li_logo`}>
          <Link to='/' smooth={true} onClick={menuClick}>
            <span>WORDS</span> Learner
            <img className="nav__img" src={arrows} alt="arrows"></img>
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
