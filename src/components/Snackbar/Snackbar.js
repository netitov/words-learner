import React from 'react';
import CloseBtn from '../CloseBtn/CloseBtn';

function Snackbar({ snackbarActive, elClass, text, children, closeSnack, closeBtnColor, transformPos }) {

  return (
    <div
      className={`snackbar${snackbarActive ? ' snackbar_active' : ''} ${transformPos || '_bottom'} ${elClass || ''}`}
    >
      <div className='snackbar__container'>
        {children}
        <p>{text}</p>
      </div>
      <CloseBtn
        width='0.7em'
        color={closeBtnColor || '#fff'}
        strokeWidth='5px'
        onBtnClick={closeSnack}
      />

    </div>
  )
}

export default Snackbar;
