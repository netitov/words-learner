import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import { FiLogOut } from 'react-icons/fi';

function DropdownNav({ closeMenu, items, route, menuActive }) {

  const { handleLogout } = useAuth();

  function logout() {
    handleLogout();
    closeMenu();
  }

  // close menu on overlay click
  useEffect(() => {
    function handleOverlayClick (e) {
      if (e.target.classList[0] === 'dropdown-overlay') {
        closeMenu();
      }
    };

    if (menuActive) {
      document.addEventListener('click', handleOverlayClick);
    }

    return () => {
      document.removeEventListener('click', handleOverlayClick);
    };
  }, [menuActive]);

  return (
    <motion.div
      className='dropdown-overlay'
      initial={{ y: '100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '100%', opacity: 0 }}
      transition={{ ease: 'easeOut' }}
    >
      <nav className='dropdown'>
        <ul>
          {items.map((i) => (
            <li key={i.title}>
              <Link
                to={i.route}
                className={`dropdown__link${route === i.route ? ' dropdown__link_active' : ''}`}
                onClick={closeMenu}
              >
                {i.icon}
                {i.title}
              </Link>
            </li>
          ))}
          <li>
            <span className='dropdown__link' onClick={logout}>
              <FiLogOut />
              SignOut
            </span>
          </li>
        </ul>
      </nav>

    </motion.div>
  )
}

export default DropdownNav;
