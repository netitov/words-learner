import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  data: [],
  isLoading: false,
};

const randomWordsSlice = createSlice({
  name: 'randomWords',
  initialState,
  reducers: {
    setRandomWords(state, action) {
      return { ...state, data: action.payload };
    },
    setLoading(state, action) {
      return { ...state, isLoading: action.payload };
    },
  },
});

export const { setRandomWords, setLoading } = randomWordsSlice.actions;
export default randomWordsSlice.reducer;
