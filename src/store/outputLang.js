import { createSlice } from '@reduxjs/toolkit';

const initialState = { lang: '', code: '' };

const outputLangSlice = createSlice({
  name: 'inputLang',
  initialState,
  reducers: {
    selectOutputLang(state, action) {
      return action.payload;
    },
  },
});

export const { selectOutputLang } = outputLangSlice.actions;
export default outputLangSlice.reducer;
