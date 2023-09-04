import React, { useState, useEffect } from 'react';
import CollectionSummary from '../CollectionSummary/CollectionSummary';
import { useDispatch, useSelector } from 'react-redux';
import { minPassedTests } from '../../utils/constants';
import AreaChart from './AreaChart';
import BarChart from './BarChart';
import dayjs from 'dayjs';

function Progress() {

  const [addedWords, setAddedWords] = useState([]);
  const [learnedWords, setLearnedWords] = useState([]);
  const [collectionData, setCollectionData] = useState([]);
  const [quizData, setQuizData] = useState([]);
  const [months, setMonths] = useState([]);

  const userWords = useSelector((state) => state.userWords);
  const collections = useSelector((state) => state.collections);
  const quizzes = useSelector((state) => state.quizResults);

  const collectionsLimit = 5;

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

  //get monthly values
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

  function addWordsToCollection(arr, obj, collection, key) {
    arr.forEach((w) => {
      w?.source?.forEach((s) => {
        if (collection._id === s.collectionId) {
          if (obj[key] === 0) {
            obj[key] = 1;
          } else {
            obj[key]++
          }
        }
      })
    })
  }

  function sortArrByDate(arr) {
    const sortedArr = [...arr];

    sortedArr.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;
    });

    return sortedArr;
  }

  //get array of collections and words
  function getWordsByCollection() {
    const resultArr = [];

    collections.forEach((c) => {
      //limit collection name length
      const collectionName = c.collectionName.substring(0, 12);

      const obj = {
        collectionName,
        createdAt: c.createdAt,
        totalWords: 0,
        learnedWords: 0
      };

      //add total words
      addWordsToCollection(userWords, obj, c, 'totalWords');

      //add learned words
      const learnedWords = getLearnedWords(userWords);
      if(learnedWords.length > 0) {
        addWordsToCollection(learnedWords, obj, c, 'learnedWords');
      }

      //if word doesn't have collection, put 'no collection'
      //skip objects with no words
      if (Object.keys(obj).length === 0) {
        const emptySource = userWords.filter((w) => {
          return w.source.length === 0;
        })
        emptySource.length > 0 && resultArr.push({ ['no collection']: emptySource.length })
      } else {
        obj.totalWords > 0 && resultArr.push(obj);
      }
    })

    return sortArrByDate(resultArr);
  }

  //set data for charts
  useEffect(() => {
    setAddedWords(getChartsValue(userWords, 'createdAt'));
    setLearnedWords(getChartsValue(getLearnedWords(userWords), 'learnDate'));
    setCollectionData(getWordsByCollection().slice(0, collectionsLimit));
    setMonths(getDatesArray());
    setQuizData(getChartsValue(quizzes, 'date'))
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
          labels={months}
          values={addedWords.map(i => i.value)}
        />

        {/* Collections chart */}
        <BarChart
          title='Collections'
          labels={collectionData.map(i => i.collectionName)}
          dataset1={collectionData.map(i => i.learnedWords)}
          dataset2={collectionData.map(i => i.totalWords - i.learnedWords)}
        />

        {/* Learned words chart */}
        <AreaChart
          title='Learned words'
          labels={months}
          values={learnedWords.map(i => i.value)}
        />

        {/* Quizes taken*/}
        <AreaChart
          title='Quizzes taken'
          labels={months}
          values={quizData.map(i => i.value)}
        />

      </div>
    </div>
  )
}

export default Progress;
