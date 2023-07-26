// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import inputLangReducer from './inputLang';
import outputLangReducer from './outputLang';
import langListReducer from './langList';
import filteredLangsReducer from './filteredLangs';
import dictionLangsReducer from './dictionLangs';

const store = configureStore({
  reducer: {
    inputLang: inputLangReducer,
    outputLang: outputLangReducer,
    langList: langListReducer,
    filteredLangs: filteredLangsReducer,
    dictionLangs: dictionLangsReducer,
    devTools: process.env.NODE_ENV !== 'production',
  },
});

export default store;
