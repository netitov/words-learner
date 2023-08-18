import React, { useState } from 'react';
import { getStyle } from '../../utils/constants';
import { BsBookmarksFill } from 'react-icons/bs';
import CloseBtn from '../CloseBtn/CloseBtn';
import { useSelector, useDispatch } from 'react-redux';
import { addCollection } from '../../store/collections';
import { createCollection, deleteCollection } from '../../utils/api';

function Collections() {

  const [formActive, setFormAсtive] = useState(false);
  const [collectName, setCollectName] = useState('');
  const [styles, setStyles] = useState({});
  const [formStyle, setFormStyle] = useState({});

  const collections = useSelector((state) => state.collections);
  const dispatch = useDispatch();

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

  function openForm() {
    setFormAсtive(true);
    const randomColors = patternColors[generateRandomNumber(patternColors.length)];
    //get random pattern with random color. 11 - amount of patterns
    const collectionStyle = getStyle(randomColors)[generateRandomNumber(11)];
    setFormStyle(collectionStyle.style);
    setStyles({ colors: randomColors, pattern: collectionStyle.pattern });
  }

  function closeForm() {
    setFormAсtive(false);
  }

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
        //update list of collections
        dispatch(addCollection(createdCollection));
        sessionStorage.setItem('collections', JSON.stringify([createdCollection, ...collections]));
        //dropp form data
        setCollectName('');
        closeForm();
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
          <div className='collection__overlay' style={getStyle(i.style.colors).find((s) => s.pattern === i.style.pattern).style}></div>
          <h3 className='collection__title'>{i.collectionName}</h3>
        </div>
      ))}

    </div>
  )
}

export default Collections;
