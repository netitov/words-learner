import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import { tooltipOption, minPassedTests } from '../../utils/constants';

function CollectionProgress({ userWords, collection }) {
  const collectionWords = userWords.filter((w) =>
    w.source.some((el) => el.collectionId === collection._id),
  );
  // words for which the quiz was passed at least 3 times (minPassedTests)
  function getLearnedWords(arr) {
    return arr.filter((i) => {
      const learnedWords = i.results.filter((el) => el.value === true).length;

      return learnedWords >= minPassedTests;
    });
  }
  const learnedWords = getLearnedWords(collectionWords).length;
  const progress = learnedWords === 0 ? 0 : (learnedWords / collectionWords.length) * 100;

  return (
    <Tooltip
      title='Learning progress: learned / total words'
      componentsProps={{ tooltip: { sx: tooltipOption } }}
    >
      <div className='collection-chart__progress'>
        <div className='collection-chart__progress-chart'>
          <div className='collection-chart__progress-done' style={{ width: `${progress}%` }} />
        </div>
        <span>
          {learnedWords} / {collectionWords.length}
        </span>
      </div>
    </Tooltip>
  );
}

export default CollectionProgress;
