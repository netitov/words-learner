// src/redux/slices/languageSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = { lang: 'English', code: 'en' }; // Значение по умолчанию - язык "en"

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
