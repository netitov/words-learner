import React from 'react';

function Burger(props) {
  return (
    <button className={`burger${props.active ? ' burger_active' : ''}`} id="burger" onClick={props.openMenu} type="button">
      <span className="burger-line" />
      <span className="burger-line" />
      <span className="burger-line" />
    </button>
  );
}

export default Burger;
