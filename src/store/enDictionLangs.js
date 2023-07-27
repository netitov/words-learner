// src/redux/slices/languageSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const enDictionLangsSlice = createSlice({
  name: 'enDictionLangs',
  initialState,
  reducers: {
    setEnDictionLangs(state, action) {
      return action.payload;
    },
  },
});

export const { setEnDictionLangs } = enDictionLangsSlice.actions;
export default enDictionLangsSlice.reducer;
