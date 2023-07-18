import React from 'react';

function Snackbar(props) {

  return (
    <div
      className={`snackbar${props.snackbarActive ? ' snackbar_active' : ''} ${props.class || ''}`}
    >
      {props.children}
      <p>{props.text}</p>
    </div>
  )
}

export default Snackbar;
