import React, { useState } from 'react';
import { getStyle, tooltipOption } from '../../utils/constants';
import { BsBookmarksFill } from 'react-icons/bs';
import { GoKebabHorizontal } from 'react-icons/go';
import CloseBtn from '../CloseBtn/CloseBtn';
import { useSelector, useDispatch } from 'react-redux';
import { addCollection, updateCollection } from '../../store/collections';
import { createCollection, deleteCollection } from '../../utils/api';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

function Collections() {

  const [formActive, setFormAсtive] = useState(false);
  const [collectName, setCollectName] = useState('');
  const [styles, setStyles] = useState({});
  const [formStyle, setFormStyle] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

  const collections = useSelector((state) => state.collections);
  const dispatch = useDispatch();

  const menuActive = Boolean(anchorEl);

  function openMenu(event) {
    setAnchorEl(event.currentTarget);
  }

  function closeMenu() {
    setAnchorEl(null);
  }

  const patternColors = [
    {
      frontColor: '#2e5760',
      backColor: '#7da1a9'
    },
    {
      frontColor: '#FFD987',
      backColor: '#FFE8B7'
    },
    {
      frontColor: '#757575',
      backColor: '#A8A8A8'
    }
  ];

  //open form for creating new collection
  function openForm() {
    setFormAсtive(true);
    const randomColors = patternColors[generateRandomNumber(patternColors.length)];
    //get random pattern with random color. 11 - amount of patterns
    const collectionStyle = getStyle(randomColors)[generateRandomNumber(11)];
    setFormStyle(collectionStyle.style);
    setStyles({ colors: randomColors, pattern: collectionStyle.pattern });
  }

  //close form and clear input
  function closeForm() {
    setFormAсtive(false);
    setCollectName('');
  }

  //remove default value in array
  function updateDefault(initCollects) {
    return initCollects.map(col => {
      if (col.default) {
        return { ...col, default: false };
      }
      return col;
    });
  }

  //submit form - create new collection
  async function handleSubmit(e) {
    e.preventDefault();

    if (collectName) {
      const token = localStorage.getItem('token');
      const collectObj = {
        collectionName: collectName,
        style: styles,
        default: true
      };

      //create collection in DB
      const createdCollection = await createCollection(collectObj, token);

      if (createdCollection.err) {
        return createdCollection.err;
      } else {
        closeForm();

        //update session storage (add new collection and remove current default value)
        const updatedCollections = updateDefault(collections);
        sessionStorage.setItem('collections', JSON.stringify([createdCollection, ...updatedCollections]));

        //add new collection and remove current default
        dispatch(addCollection(createdCollection));
      }
    }
  }

  function generateRandomNumber(maxNumber) {
    return Math.floor(Math.random() * maxNumber);
  }

  return (
    <div className='collections' >

      {/* btn: add new collection */}
      <div className='collection-new'>
        <button className='collection-new__btn' type='button' onClick={() => openForm()}>
          <div className='collection-new__icon'>
            <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'>
              <line x1='0' x2='100' y1='0' y2='100' />
              <line x1='0' x2='100' y1='100' y2='0' />
            </svg>
          </div>
          <h3 className='collection-new__title'>Add new collection</h3>
        </button>
      </div>

      {/* collection: all saved words */}
      <div className='collection collection_all'>
        <BsBookmarksFill className='collection__bm-icon'/>
        <h3 className='collection__title collection__title_all'>All saved words</h3>
      </div>

      {/* form for new collection */}
      <div className={`collection collections__form${formActive ? ' collections__form_active' : ''}`} >
        <div className='collection__overlay' style={formStyle}></div>
        <form className='collection__form' onSubmit={handleSubmit}>
          <input
            type='text'
            className='collection__title collection__title_input'
            placeholder='enter collection name'
            value={collectName}
            onChange={(e) => setCollectName(e.target.value)}
            maxLength='55'
          />
          <button type='submit' className='collection__btn'>Create collection</button>
        </form>
        <CloseBtn
          width='13px'
          color='#fff'
          strokeWidth='13'
          onBtnClick={closeForm}
          elClass='collection__close-btn'
        />
      </div>

      {/* created collections by user */}
      {collections.map((i) => (
        <div className='collection' key={i.collectionName} >
          {i.default &&
            <Tooltip title='Words will be saved in this collection by default' componentsProps={{ tooltip: { sx: tooltipOption, } }}>
              <span className='collection__def'>default</span>
            </Tooltip>
          }
          <button type='button' className='collection__menu-btn' id="basic-button" onClick={openMenu}>
            <GoKebabHorizontal size='22px' color='#fff' />
          </button>
          <Menu
            id='ctx-menu'
            anchorEl={anchorEl}
            open={menuActive}
            onClose={closeMenu}
            className='collection__cxt-menu'
            MenuListProps={{
              'aria-labelledby': 'ctx-menu',
            }}
          >
            <MenuItem onClick={closeMenu}>Open collection</MenuItem>
            <MenuItem onClick={closeMenu}>Delete</MenuItem>
            <MenuItem onClick={closeMenu}>Make defualt</MenuItem>
          </Menu>
          <div className='collection__overlay' style={getStyle(i.style.colors).find((s) => s.pattern === i.style.pattern).style}></div>
          <h3 className='collection__title'>{i.collectionName}</h3>
        </div>
      ))}

    </div>
  )
}

export default Collections;
