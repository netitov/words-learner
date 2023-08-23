import { createSlice } from '@reduxjs/toolkit';

const initialState = [];

const langListSlice = createSlice({
  name: 'langList',
  initialState,
  reducers: {
    setLangList(state, action) {
      return action.payload;
    },
  },
});

export const { setLangList } = langListSlice.actions;
export default langListSlice.reducer;
