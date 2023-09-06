import React from 'react';

function Spinner(props) {
  return <div className={`spinner${props.isLoading ? ' spinner_active' : ''}`} />;
}

export default Spinner;
