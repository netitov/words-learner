import React from 'react';
import { Link } from 'react-router-dom';
import { accountNav } from '../../utils/constants';
import { useSelector } from 'react-redux';

function CardNav() {

  const userData = useSelector((state) => state.user.userData);

  return (
    <div className='cardnav-wrapper'>
      <h2>{userData.userName !== '' ? `Welcome, ${userData.userName}!` : 'Welcome!'}</h2>
      <nav className='cardnav'>
        <ul>
          {accountNav
            .filter((el) => el.title !== 'My account')
            .map((i) => (
              <li key={i.title}>
                <Link to={i.route} className='cardnav__link'>
                  {i.icon}
                  {i.title}
                </Link>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
}

export default CardNav;
