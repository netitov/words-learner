// src/redux/slices/languageSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = []; // Значение по умолчанию - язык "en"

const filteredLangsSlice = createSlice({
  name: 'filteredLangs',
  initialState,
  reducers: {
    setFilteredLangs(state, action) {
      return action.payload;
    },
  },
});

export const { setFilteredLangs } = filteredLangsSlice.actions;
export default filteredLangsSlice.reducer;
