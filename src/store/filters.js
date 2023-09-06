import { createSlice } from '@reduxjs/toolkit';

const initialState = { frSt: 3, frEn: 5.5 };

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilters(state, action) {
      return action.payload;
    },
  },
});

export const { setFilters } = filtersSlice.actions;
export default filtersSlice.reducer;
