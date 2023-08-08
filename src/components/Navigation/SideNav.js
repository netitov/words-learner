import React from 'react';
import { Link } from 'react-router-dom';
import { accountNav } from '../../utils/constants';


function SideNav({ route }) {
  return (
    <nav className='sidenav'>
      <ul>
        {accountNav.map((i) => (
          <li key={i.title}>
            <Link to={i.route} className={`sidenav__link${route === i.route ? ' sidenav__link_active' : ''}`}>
              {i.icon}
              {i.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default SideNav;
