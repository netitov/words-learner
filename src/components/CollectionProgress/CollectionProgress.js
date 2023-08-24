import React from 'react';
import { Tooltip } from '@mui/material';
import { tooltipOption } from '../../utils/constants';

function CollectionProgress({ userWords, collection }) {

  const collectionWords = userWords.filter((w) => w.source.some(el => el.collectionId === collection._id)).length;

  return (
    <Tooltip title='Learning progress: learned / total words' componentsProps={{ tooltip: { sx: tooltipOption, } }}>
      <div className='collection-chart__progress'>
        <div className='collection-chart__progress-chart'>
          <div className='collection-chart__progress-done' style={{ width: '35%' }}></div>
        </div>
        <span>3 / {collectionWords}</span>
      </div>
    </Tooltip>
  )
}

export default CollectionProgress;
