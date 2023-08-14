import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

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
  },
});

export const { setUserWords, addNewWords, deleteWord } = userWordsSlice.actions;
export default userWordsSlice.reducer;
