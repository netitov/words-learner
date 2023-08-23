import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getStyle, tooltipOption } from '../../utils/constants';
import { BsBookmarksFill } from 'react-icons/bs';
import { GoKebabHorizontal } from 'react-icons/go';
import CloseBtn from '../CloseBtn/CloseBtn';
import { useSelector, useDispatch } from 'react-redux';
import { addCollection, updateCollectionState, updateDefaultState, deleteCollection } from '../../store/collections';
import { createCollectionDB, deleteCollectionDB, updateCollectionDB } from '../../utils/api';
import Tooltip from '@mui/material/Tooltip';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import useWordSave from '../../hooks/useWordSave';

function Collections() {

  const [formActive, setFormAсtive] = useState(false);
  const [collectName, setCollectName] = useState('');
  const [styles, setStyles] = useState({});
  const [formStyle, setFormStyle] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [targetCollection, setTargetCollection] = useState({});
  const [deleteFormActive, setDeleteFormActive] = useState(false);

  const [menuActive, setMenuActive] = React.useState(false);

  const collections = useSelector((state) => state.collections);
  const dispatch = useDispatch();

  const { removeWordList, updateCollectionData } = useWordSave();

  const anchorRef = useRef(null);

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

  function openMenu(i, e) {
    setAnchorEl(e.currentTarget);
    setMenuActive(true);
    //set collection where menu was opened
    setTargetCollection(i);
    //drop preveious form
    setDeleteFormActive(false);
  }

  function closeMenu(e) {
    setAnchorEl(null);
    setMenuActive(false);
  }

  //open form for creating new collection
  function openForm() {
    setFormAсtive(true);
    const randomColors = patternColors[generateRandomNumber(patternColors.length)];
    //get random pattern with random color. 11 - amount of patterns
    const collectionStyle = getStyle(randomColors)[generateRandomNumber(11)];
    setFormStyle(collectionStyle.style);
    setStyles({ colors: randomColors, pattern: collectionStyle.pattern });
  }

  //close form for new collection and clear input
  function closeForm() {
    setFormAсtive(false);
    setCollectName('');
  }

  //remove default value in array
  function droppDefaultStateStorage(initCollects) {
    return initCollects.map(col => {
      if (col.default) {
        return { ...col, default: false };
      }
      return col;
    });
  }

  //update collections data array for storage
  function updateCollectionsStorage(collections, updatedCollection) {
    return collections.map(i => {
      if (updatedCollection.default) {
        return i._id === updatedCollection._id ? updatedCollection : { ...i, default: false };
      } else {
        return i._id === updatedCollection._id ? updatedCollection : i;
      }

    });
  }

  //create new collection
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
      const createdCollection = await createCollectionDB(collectObj, token);

      if (createdCollection.error) {
        return createdCollection.error;
      } else {
        closeForm();

        //update session storage (add new collection and remove current default value)
        const updatedCollections = droppDefaultStateStorage(collections);
        sessionStorage.setItem('collections', JSON.stringify([createdCollection, ...updatedCollections]));

        //add new collection and remove current default
        dispatch(addCollection(createdCollection));
      }
    }
  }

  function openDeleteForm() {
    setDeleteFormActive(true);
    closeMenu();
  }

  function closeDeleteForm() {
    setDeleteFormActive(false);
    setTargetCollection({});
  }

  async function handleDeleteCollection(deleteWords) {
    const token = localStorage.getItem('token');
    const deletedCollection = await deleteCollectionDB(targetCollection._id, token);

    if (deletedCollection.error) {
      console.log(deletedCollection.error);
      //error handler - display error snack
    } else {
      //update state and storage
      dispatch(deleteCollection(deletedCollection._id));
      const collectionStorage = JSON.parse(sessionStorage.getItem('collections'));
      const updatedCollectionList = collectionStorage.filter(i => i._id !== deletedCollection._id);
      sessionStorage.setItem('collections', JSON.stringify(updatedCollectionList));

      //update collection data in user words
      if (deleteWords) {
        //remove words from deleted collection
        await removeWordList(targetCollection._id);
      } else {
        //update collection in word list
        await updateCollectionData(targetCollection._id);
      }
    }
    closeDeleteForm();
  }

  //edit collection data: title, default state
  async function handleUpdate(collectionObj) {
    const token = localStorage.getItem('token');
    const updatedCollection = await updateCollectionDB(targetCollection._id, token, collectionObj);

    closeMenu();

    if (updatedCollection.error) {
      //error text
      //setError({ serverError });
      console.log(updatedCollection.error);
    } else {
      dispatch(updateDefaultState(updatedCollection));


      //update session storage (add new collection and remove current default value)
      const updatedCollections =  updateCollectionsStorage(collections, updatedCollection);
      sessionStorage.setItem('collections', JSON.stringify(updatedCollections));
      console.log(updatedCollection)
    }
  }

  //edit collection data: title, default state
  async function handleUpdate(collectionObj) {
    const token = localStorage.getItem('token');
    const updatedCollection = await updateCollectionDB(targetCollection._id, token, collectionObj);

    closeMenu();

    if (updatedCollection.error) {
      //error text
      //setError({ serverError });
      console.log(updatedCollection.error);
    } else {
      dispatch(updateDefaultState(updatedCollection));


      //update session storage (add new collection and remove current default value)
      const updatedCollections =  updateCollectionsStorage(collections, updatedCollection);
      sessionStorage.setItem('collections', JSON.stringify(updatedCollections));
      console.log(updatedCollection)
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
      <Link className='collection collection_all' to='/account/words'>
        <BsBookmarksFill className='collection__bm-icon'/>
        <h3 className='collection__title collection__title_all'>All saved words</h3>
      </Link>

      {/* form for new collection */}
      {formActive && (
        <div className={`collection collections__form${formActive ? ' collections__form_active' : ''}`}
        >
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
      )}

      {/* created collections by user */}
      {collections.map((i) => (
        <div className='collection' key={i._id} >
          <Link to={`/account/words/collections/${i._id}`}>
            {i.default &&
              <Tooltip title='Words will be saved in this collection by default' componentsProps={{ tooltip: { sx: tooltipOption, } }}>
                <span className='collection__def' >default</span>
              </Tooltip>
            }
            {/* pattern and collection name */}
            <div className='collection__overlay' style={getStyle(i.style.colors).find((s) => s.pattern === i.style.pattern).style}></div>
            <h3 className='collection__title'>{i.collectionName}</h3>
          </Link>

          {/* context menu */}
          <div>
            <button
              type='button'
              className='collection__menu-btn'
              id='ctx-menu-btn'
              /* ref={anchorEl} */
              onClick={(e) => openMenu(i, e)}
            >
              <GoKebabHorizontal size='22px' color='#fff' />
            </button>
            {targetCollection._id === i._id && (
              <Popper
                open={menuActive}
                anchorEl={anchorEl}
                role={undefined}
                placement='bottom-start'
                transition
                disablePortal
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin:
                        placement === 'bottom-start' ? 'left top' : 'left bottom',
                    }}
                  >
                    <Paper className='collection__cxt-menu'>
                      <ClickAwayListener onClickAway={closeMenu}>
                        <MenuList
                          autoFocusItem={menuActive}
                          id='composition-menu'
                          aria-labelledby='composition-button'
                        >
                          <MenuItem onClick={closeMenu}>Open collection</MenuItem>
                          <MenuItem onClick={openDeleteForm}>Delete</MenuItem>
                          <MenuItem onClick={() => handleUpdate({ default: true })}>Set as default</MenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            )}
          </div>

          {/* deleting overlay */}
          {targetCollection._id === i._id && deleteFormActive &&
            <div className='collection__dlt-overlay'>
              <p>What would you like to delete?</p>
              <button
                className='collection__dlt-btn'
                type='button'
                onClick={() => handleDeleteCollection(false)} //false - don't delete words
              >
                Collection only
              </button>
              <button
                className='collection__dlt-btn'
                type='button'
                onClick={() => handleDeleteCollection(true)} //true - delete collection and words
              >
                  Collection and words
                </button>
              <CloseBtn
                width='13px'
                color='#fff'
                strokeWidth='13'
                onBtnClick={closeDeleteForm}
                elClass='collection__close-btn'
              />
            </div>
          }

        </div>
      ))}


    </div>
  )
}

export default Collections;