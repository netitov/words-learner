import React, { useState, useEffect, useRef } from 'react';

import { BsBookmarks } from 'react-icons/bs';
import { VscGitCompare } from 'react-icons/vsc';
import { MdTranslate } from 'react-icons/md';

function Menu(props) {

  const [offset, setOffset] = useState({});
  const menuRef = useRef(null);

  //change menu possition if it overflows the page
  useEffect(() => {
    const elementPoss = menuRef.current.getBoundingClientRect().x + menuRef.current.offsetWidth;
    if (elementPoss > (window.innerWidth - 15)) {
      setOffset({ right: 0, left: 'auto' });
    }
  }, [props.menuActive])

  return (
    <div
      className={`menu${props.menuActive ? ' menu_active' : ''}`}
      ref={menuRef}
      style={offset}
    >
      <ul className='menu__ul'>
        <li className='menu__li' onClick={props.addTranslate}>
          <MdTranslate />
          <span>translate</span>
        </li>
        <li className='menu__li' onClick={props.addToList}>
          <BsBookmarks />
          <span>add to the learning list</span>
        </li>
        <li
          className={`menu__li${!props.compareFreqActive ? ' menu__li_inactive' : ''}`}
          onClick={props.compareFreq}
        >
          <VscGitCompare />
          <span>compare the frequency</span>
        </li>
      </ul>
    </div>
  )
}

export default Menu;
