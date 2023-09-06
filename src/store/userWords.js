import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const handleUpdateWord = (words, updatingWord) => {
  return words.map((wordObj) => {
    return wordObj._id === updatingWord._id ? updatingWord : wordObj;
  });
};

const handleUpdateWordsArr = (words, updatingWords) => {
  return words.map((wordObj) => {
    const matchingUpdatedWords = updatingWords.find((i) => i._id === wordObj._id);
    return matchingUpdatedWords ? matchingUpdatedWords : wordObj;
  });
};

const userWordsSlice = createSlice({
  name: 'userWords',
  initialState,
  reducers: {
    setUserWords(state, action) {
      return action.payload;
    },
    addNewWords(state, action) {
      return [...state, ...action.payload];
    },
    deleteWord(state, action) {
      const wordIdToDelete = action.payload;
      return state.filter((word) => word.word !== wordIdToDelete);
    },
    deleteWordsArray(state, action) {
      const wordsToDelete = action.payload.map((wordObj) => wordObj._id);
      return state.filter((word) => !wordsToDelete.includes(word._id));
    },
    updateWordState(state, action) {
      const updatingWords = action.payload;
      const updatedWords = handleUpdateWordsArr(state, updatingWords);
      return updatedWords;
    },
    updateWord(state, action) {
      const updatingWords = action.payload;
      const updatedWords = handleUpdateWord(state, updatingWords);
      return updatedWords;
    },
  },
});

export const {
  setUserWords,
  addNewWords,
  deleteWord,
  deleteWordsArray,
  updateWordState,
  updateWord,
} = userWordsSlice.actions;
export default userWordsSlice.reducer;
