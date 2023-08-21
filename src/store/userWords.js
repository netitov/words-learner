import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const handleUpdateWords = (words, updatingWords) => {
  return words.map(wordObj => {
    const matchingUpdatedWords = updatingWords.find(i => i._id === wordObj._id);
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
      return state.filter(word => word.word !== wordIdToDelete);
    },
    deleteWordsArray(state, action) {
      const wordsToDelete = action.payload.map(wordObj => wordObj._id);
      return state.filter(word => !wordsToDelete.includes(word._id));
    },
    updateWordState(state, action) {
      const updatingWords = action.payload;
      const updatedWords = handleUpdateWords(state, updatingWords);
      return updatedWords;
    }
  },
});

export const { setUserWords, addNewWords, deleteWord, deleteWordsArray, updateWordState } = userWordsSlice.actions;
export default userWordsSlice.reducer;
