import React from 'react';

import { BsBookmarks } from 'react-icons/bs';
import { VscGitCompare } from 'react-icons/vsc';
import { MdTranslate } from 'react-icons/md';

function Menu(props) {

  return (
    <div className={`menu${props.menuActive ? ' menu_active' : ''}`} >
      <ul className='menu__ul'>
        <li className='menu__li' onClick={props.translate}>
          <MdTranslate />
          <span>translate</span>
        </li>
        <li className='menu__li' onClick={props.addToList}>
          <BsBookmarks />
          <span>add to the learning list</span>
        </li>
        <li className='menu__li' onClick={props.compareFreq}>
          <VscGitCompare />
          <span>compare the frequency</span>
        </li>
      </ul>
    </div>
  )
}

export default Menu;
