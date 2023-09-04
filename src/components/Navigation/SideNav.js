import React from 'react';
import { Link } from 'react-router-dom';
import { accountNav } from '../../utils/constants';
import { FiLogOut } from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';

function SideNav({ route }) {

  const { handleLogout } = useAuth();

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
        <li>
          <span className='sidenav__link' onClick={handleLogout}>
            <FiLogOut />
            SignOut
          </span>
        </li>
      </ul>
    </nav>
  )
}

export default SideNav;
