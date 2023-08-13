import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    setQuiz(state, action) {
      return action.payload;
    },
  },
});

export const { setQuiz } = quizSlice.actions;
export default quizSlice.reducer;
