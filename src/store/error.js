import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  errorMessage: null,
};

const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    showError: (state, action) => {
      state.errorMessage = action.payload;
    },
    closeError: (state) => {
      state.errorMessage = null;
    },
  },
});

export const { showError, closeError } = errorSlice.actions;
export default errorSlice.reducer;
