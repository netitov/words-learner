import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  userData: {
    email: '',
    userName: '',
  },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.userData = action.payload.userData;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userData = {};
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
