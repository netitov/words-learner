// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import inputLangReducer from './inputLang';
import outputLangReducer from './outputLang';
import langListReducer from './langList';
import filteredLangsReducer from './filteredLangs';
import dictionLangsReducer from './dictionLangs';
import enDictionLangsReducer from './enDictionLangs';
import userReducer from './user';
import userWordsReducer from './userWords';
import randomWordsReducer from './randomWords';
import quizReducer from './quiz';
import filtersReducer from './filters';
import collectionsReducer from './collections';
import errorReducer from './error';

const store = configureStore({
  reducer: {
    inputLang: inputLangReducer,
    outputLang: outputLangReducer,
    langList: langListReducer,
    filteredLangs: filteredLangsReducer,
    dictionLangs: dictionLangsReducer,
    enDictionLangs: enDictionLangsReducer,
    user: userReducer,
    userWords: userWordsReducer,
    randomWords: randomWordsReducer,
    quiz: quizReducer,
    filters: filtersReducer,
    collections: collectionsReducer,
    error: errorReducer,
    devTools: process.env.NODE_ENV !== 'production',
  },
});

export default store;
