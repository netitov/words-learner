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
  },
});

export const { setUserWords, addNewWords } = userWordsSlice.actions;
export default userWordsSlice.reducer;
