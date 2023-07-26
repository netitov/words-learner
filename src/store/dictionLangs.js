// src/redux/slices/languageSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const dictionLangsSlice = createSlice({
  name: 'dictionLangs',
  initialState,
  reducers: {
    setDictionLangs(state, action) {
      return action.payload;
    },
  },
});

export const { setDictionLangs } = dictionLangsSlice.actions;
export default dictionLangsSlice.reducer;
