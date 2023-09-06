import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { accountNav } from '../../utils/constants';
import { GoKebabHorizontal } from 'react-icons/go';
import { AnimatePresence } from 'framer-motion';
import DropdownNav from './DropDownNav';

function MobNav({ route }) {

  const [dropdownMenuActive, setDropdownMenuActive] = useState(false);

  function closeAddMenu() {
    setDropdownMenuActive(false);
  }

  function openAddMenu() {
    setDropdownMenuActive(true);
  }

  return (
    <nav className='mobnav'>
      <ul>

        {/* main menu */}
        {accountNav.filter(el => el.menu === 'mobile').map((i) => (
          <li key={i.shortTitle}>
            <Link to={i.route} className={`mobnav__link${route === i.route ? ' mobnav__link_active' : ''}`}>
              {i.icon}
              {i.shortTitle}
            </Link>
          </li>
        ))}

        {/* btn for dropdown menu */}
        <li>
          <span className='mobnav__link' title='other features' onClick={openAddMenu}>
            <GoKebabHorizontal size={25} />
          </span>
        </li>
      </ul>

      {/* dropdown menu */}
      <AnimatePresence>
        {dropdownMenuActive &&
          <DropdownNav
            closeMenu={closeAddMenu}
            items={accountNav.filter(i => i.menu === 'context')}
            route={route}
            menuActive={dropdownMenuActive}
          />
        }
      </AnimatePresence>

    </nav>
  )
}

export default MobNav;
