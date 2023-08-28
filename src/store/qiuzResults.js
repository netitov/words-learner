import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const quizResultsSlice = createSlice({
  name: 'quizResults',
  initialState,
  reducers: {
    setQuizResults(state, action) {
      return action.payload;
    },
    addResult(state, action) {
      return [...state, action.payload];
    },
  },
});

export const { setQuizResults, addResult } = quizResultsSlice.actions;
export default quizResultsSlice.reducer;
