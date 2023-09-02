import React, { useState, useEffect } from 'react';
import CollectionSummary from '../CollectionSummary/CollectionSummary';
import { useDispatch, useSelector } from 'react-redux';
import { minPassedTests } from '../../utils/constants';
import AreaChart from './AreaChart';
import dayjs from 'dayjs';

function Progress() {

  const [addedWords, setAddedWords] = useState([]);
  const [learnedWords, setLearnedWords] = useState([]);
  const userWords = useSelector((state) => state.userWords);

  //get last 6 months
  function getDatesArray() {
    const currentDate = dayjs();
    const dateArray = [];

    for (let i = 0; i < 6; i++) {
      const currElement = currentDate.subtract(i, 'month');
      const formattedDate = currElement.format('MMM.YY');
      dateArray.unshift(formattedDate);
    }

    return dateArray;
  }

  //get monthly added words
  function getChartsValue(arr, dateName) {

    const dates = getDatesArray();
    const resArr = [];

    dates.forEach((i) => {
      const foundWords = arr.filter((w) => {
        const monthYear = dayjs(w[dateName]).format('MMM.YY');
        return i === monthYear;
      })

      resArr.push({ date: i, value: foundWords.length });
    })

    return resArr;
  }

  //get monthly learned words
  function getLearnedWords(arr) {
    const filteredArr = arr.filter((i) => {

      const learnedWords = i.results.filter(el => el.value === true).length;
      return learnedWords >= minPassedTests;
    });

    const arrayWithDate = filteredArr.map(i => {
      const passedQuiz = i.results.filter(el => el.value === true);
      return {...i, learnDate: passedQuiz[minPassedTests - 1].createdAt};
    })

    return arrayWithDate;
  }


  //set data for charts
  useEffect(() => {
    setAddedWords(getChartsValue(userWords, 'createdAt'));
    setLearnedWords(getChartsValue(getLearnedWords(userWords), 'learnDate'));
  }, [userWords])


  return (
    <div className='progress'>
      <CollectionSummary
        totalWords={userWords.length}
        learnedWords={getLearnedWords(userWords).length}
      />
      <div className='progress__chart-container'>

        {/* Added words chart */}
        <AreaChart
          title='Added words'
          labels={addedWords.map(i => i.date)}
          values={addedWords.map(i => i.value)}
        />

        {/* Learned words chart */}
        <AreaChart
          title='Learned words'
          labels={learnedWords.map(i => i.date)}
          values={learnedWords.map(i => i.value)}
        />

      </div>
    </div>
  )
}

export default Progress;
