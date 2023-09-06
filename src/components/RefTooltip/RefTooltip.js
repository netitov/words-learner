import React from 'react';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import Tooltip from '@mui/material/Tooltip';
import { tooltipOption } from '../../utils/constants';

function RefTooltip(props) {
  return (
    <Tooltip componentsProps={{ tooltip: { sx: tooltipOption } }} title={props.children}>
      <button className={`tooltop__btn ${props.class ? props.class : ''}`} type='button'>
        <AiOutlineQuestionCircle size='15' color={props.color} />
      </button>
    </Tooltip>
  );
}

export default RefTooltip;
