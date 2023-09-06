import React from 'react';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import Tooltip from '@mui/material/Tooltip';
import { tooltipOption } from '../../utils/constants';

function Bookmark({ toggleBookmark, isChecked, title, propClass, width, height }) {
  return (
    <Tooltip title={title} componentsProps={{ tooltip: { sx: tooltipOption } }}>
      <button className={`bookmark ${propClass || ''}`} type='button' onClick={toggleBookmark}>
        <BsBookmark style={{ display: isChecked ? 'none' : 'block', width, height }} />
        <BsBookmarkFill style={{ display: isChecked ? 'block' : 'none', width, height }} />
      </button>
    </Tooltip>
  );
}

export default Bookmark;
