
import { createSlice } from '@reduxjs/toolkit';

const initialState = { lang: 'English', code: 'en' };

const inputLangSlice = createSlice({
  name: 'inputLang',
  initialState,
  reducers: {
    selectInputLang(state, action) {
      return action.payload;
    },
  },
});

export const { selectInputLang } = inputLangSlice.actions;
export default inputLangSlice.reducer;
